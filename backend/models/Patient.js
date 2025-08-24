import mongoose from "mongoose";

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
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[\d\s\-\(\)]+$/, "Invalid phone number"],
    },
    address: {
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
    },

    // Medical Information
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    allergies: [
      {
        allergen: String,
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
        },
      },
    ],

    // Emergency Contact
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },

    // Healthcare Provider
    primaryDoctor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Audit
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Indexes
patientSchema.index({ email: 1 });
patientSchema.index({ firstName: 1, lastName: 1 });

// Virtual for full name
patientSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
patientSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birth = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
});

// Generate patient ID
patientSchema.pre("save", async function (next) {
  if (this.isNew && !this.patientId) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.patientId = `PAT${year}${String(count + 1).padStart(4, "0")}`;
  }
  next();
});

// Static methods
patientSchema.statics.findByPatientId = function (patientId) {
  return this.findOne({ patientId, isActive: true }).populate("primaryDoctor");
};

patientSchema.statics.searchPatients = function (searchTerm) {
  const regex = new RegExp(searchTerm, "i");
  return this.find({
    isActive: true,
    $or: [
      { firstName: regex },
      { lastName: regex },
      { patientId: regex },
      { email: regex },
      { phone: regex },
    ],
  });
};

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;