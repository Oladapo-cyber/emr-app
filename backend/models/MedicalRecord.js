import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema(
  {
    // Patient and Provider
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
    },
    attendingPhysician: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Attending physician is required"],
    },

    // Visit Information
    visitDate: {
      type: Date,
      required: [true, "Visit date is required"],
      default: Date.now,
    },
    visitType: {
      type: String,
      enum: [
        "routine_checkup",
        "emergency",
        "follow_up",
        "consultation",
        "procedure",
      ],
      required: [true, "Visit type is required"],
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
      ],
      required: [true, "Department is required"],
    },

    // Clinical Information
    chiefComplaint: {
      type: String,
      required: [true, "Chief complaint is required"],
      trim: true,
    },
    symptoms: [String],
    
    // Vital Signs
    vitalSigns: {
      temperature: Number,
      bloodPressure: {
        systolic: Number,
        diastolic: Number,
      },
      heartRate: Number,
      weight: Number,
      height: Number,
    },

    // Diagnosis and Treatment
    diagnosis: {
      type: String,
      required: [true, "Diagnosis is required"],
      trim: true,
    },
    treatment: {
      type: String,
      required: [true, "Treatment is required"],
      trim: true,
    },
    
    // Medications
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
      },
    ],

    // Lab Results
    labResults: [
      {
        testName: String,
        result: String,
        normalRange: String,
        status: {
          type: String,
          enum: ["normal", "abnormal", "critical"],
        },
      },
    ],

    // Attachments  
    attachments: [
      {
        filename: String,
        path: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    // Follow-up
    followUpRequired: {
      type: Boolean,
      default: false,
    },
    followUpDate: Date,
    followUpInstructions: String,

    // Status
    status: {
      type: String,
      enum: ["draft", "completed", "reviewed"],
      default: "draft",
    },

    // Notes
    notes: String,

    // Audit
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
medicalRecordSchema.index({ patient: 1, visitDate: -1 });
medicalRecordSchema.index({ attendingPhysician: 1 });
medicalRecordSchema.index({ status: 1 });

// Static methods
medicalRecordSchema.statics.findByPatient = function (patientId) {
  return this.find({ patient: patientId })
    .populate("patient attendingPhysician")
    .sort({ visitDate: -1 });
};

medicalRecordSchema.statics.findByPhysician = function (physicianId) {
  return this.find({ attendingPhysician: physicianId })
    .populate("patient")
    .sort({ visitDate: -1 });
};

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);
export default MedicalRecord;