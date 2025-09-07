import mongoose from "mongoose";

// Define the Patient schema structure
const patientSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true, 
      maxlength: [50, "First name cannot exceed 50 characters"], 
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"], 
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },

    // Contact Information
    email: {
      type: String,
      lowercase: true, 
      trim: true,
      // Regex validation for email format
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
      // Note: Email is optional for patients
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      // Regex allows: +234, 123-456-7890, (123) 456-7890, etc.
      match: [/^\+?[\d\s\-\(\)]+$/, "Invalid phone number"],
    },
    address: {
      // Nested object for structured address
      street: String,
      city: String,
      state: String,
      country: { type: String, default: "Nigeria" },
    },

    // Patient ID
    patientId: {
      type: String,
      unique: true,
      required: [true, "Patient ID is required"],
      // Format: PAT20240001, PAT20240002, etc. (generated automatically)
    },

    // Medical Information
    bloodType: {
      type: String,
      // Standard blood types - optional field
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    allergies: [
      // Array of allergy objects
      {
        allergen: String, // What they're allergic to (e.g., "Penicillin")
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"], // Severity levels
        },
      },
    ],

    // Emergency Contact
    emergencyContact: {
      // Single nested object for emergency contact
      name: String, // Contact person's name
      phone: String, // Contact person's phone
      relationship: String, // Relationship to patient (e.g., "Spouse", "Parent")
    },

    // Healthcare Provider
    primaryDoctor: {
      type: mongoose.Schema.ObjectId, // Reference to User collection
      ref: "User", // Establishes relationship with User model (doctor)
      // Optional field - patient may not have assigned doctor yet
    },

    // Status
    isActive: {
      type: Boolean,
      default: true, // New patients are active by default
      // Used for soft deletion - instead of deleting, set to false
    },

    // Audit
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User", // Reference to the user who created this patient record
      required: true, // Must track who created the record for audit purposes
    },
  },
  {
    //Schema Options
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtual fields when converting to JSON
  }
);

//Database Indexes - Improve query performance by creating sorted data structures

// Index on email field for faster email lookups
// Single field index - speeds up: Patient.findOne({ email: "john@example.com" })
patientSchema.index({ email: 1 }); // 1 = ascending order

// Compound index on firstName + lastName for faster full name searches
// Speeds up: Patient.find({ firstName: "John", lastName: "Doe" })
patientSchema.index({ firstName: 1, lastName: 1 });

//Virtual Fields- Computed properties that don't exist in the database

// Virtual for full name - combines firstName + lastName
patientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
  // Usage: patient.fullName returns "John Doe"
});

// Virtual for age calculation - computes age from dateOfBirth
patientSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null; // Return null if no birth date
  
  const today = new Date();
  const birth = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear(); // Basic year difference
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // Adjust age if birthday hasn't occurred this year yet
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
  // Usage: patient.age returns 25 (calculated automatically)
});

//Pre-save Middleware
// Runs automatically before saving a document to the database

// Generate patient ID automatically for new patients
patientSchema.pre("save", async function (next) {
  // Only run for new documents that don't have a patientId yet
  if (this.isNew && !this.patientId) {
    // Count existing patients to get next number
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear(); // Current year
    
    // Generate ID: PAT + Year + 4-digit number (PAT20240001, PAT20240002, etc.)
    this.patientId = `PAT${year}${String(count + 1).padStart(4, "0")}`;
  }
  next(); // Continue with save operation
});

//Static methods 
// Custom methods available on the Patient model itself

// Find patient by patientId and ensure they're active
patientSchema.statics.findByPatientId = function (patientId) {
  return this.findOne({ patientId, isActive: true }) // Only active patients
    .populate("primaryDoctor"); // Include doctor details in result
  // Usage: Patient.findByPatientId("PAT20240001")
};

// Search patients by multiple criteria
patientSchema.statics.searchPatients = function (searchTerm) {
  const regex = new RegExp(searchTerm, "i"); // Case-insensitive search
  
  return this.find({
    isActive: true, // Only active patients
    $or: [ // Match ANY of these conditions
      { firstName: regex },    // Search in first name
      { lastName: regex },     // Search in last name
      { patientId: regex },    // Search in patient ID
      { email: regex },        // Search in email
      { phone: regex },        // Search in phone
    ],
  });
  // Usage: Patient.searchPatients("john") - finds patients with "john" in any field
};

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;