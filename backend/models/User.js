 import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    // Authentication
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Password mpt include in queries by default
    },

    // Role-based Access Control
    role: {
      type: String,
      enum: {
        values: [
          "admin",
          "doctor",
          "nurse",
          "receptionist",
          "lab_tech",
          "pharmacist",
        ],
        message:
          "Role must be one of: admin, doctor, nurse, receptionist, lab_tech, pharmacist",
      },
      required: [true, "User role is required"],
      default: "receptionist",
    },

    // Professional Information
    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      enum: [
        "emergency",
        "cardiology",
        "neurology",
        "pediatrics",
        "orthopedics",
        "general",
        "administration",
        "laboratory",
        "pharmacy",
      ],
      required: function () {
        return this.role !== "admin";
      },
    },
    licenseNumber: {
      type: String,
      required: function () {
        return ["doctor", "nurse", "pharmacist"].includes(this.role);
      },
      trim: true,
    },
    specialization: {
      type: String,
      required: function () {
        return this.role === "doctor";
      },
      trim: true,
    },

    // Contact Information
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number"],
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },

    // Security
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    // Audit Trail
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ employeeId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual to check if account is locked
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash if password is modified
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastLogin on successful login
userSchema.pre("save", function (next) {
  if (this.isModified("lastLogin") && !this.isNew) {
    this.loginAttempts = 0;
    this.lockUntil = undefined;
  }
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.lockUntil) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};

// Instance method to check permissions
userSchema.methods.hasPermission = function (permission) {
  const rolePermissions = {
    admin: ["all"],
    doctor: [
      "view_patients",
      "edit_patients",
      "view_medical_records",
      "edit_medical_records",
      "prescribe",
      "view_appointments",
      "manage_appointments",
    ],
    nurse: [
      "view_patients",
      "edit_patients",
      "view_medical_records",
      "edit_medical_records",
      "view_appointments",
    ],
    receptionist: [
      "view_patients",
      "edit_patients",
      "view_appointments",
      "manage_appointments",
    ],
    lab_tech: ["view_patients", "view_medical_records", "edit_lab_results"],
    pharmacist: ["view_patients", "view_prescriptions", "dispense_medication"],
  };

  const userPermissions = rolePermissions[this.role] || [];
  return (
    userPermissions.includes("all") || userPermissions.includes(permission)
  );
};

// Static method to find by credentials
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await this.findOne({
    email: email.toLowerCase(),
    isActive: true,
  }).select("+password");

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.isLocked) {
    throw new Error(
      "Account is temporarily locked due to too many failed login attempts"
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incLoginAttempts();
    throw new Error("Invalid email or password");
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  return user;
};

// Static method to get users by role
userSchema.statics.findByRole = function (role) {
  return this.find({ role, isActive: true }).select("-password");
};

const User = mongoose.model("User", userSchema);

export default User;
