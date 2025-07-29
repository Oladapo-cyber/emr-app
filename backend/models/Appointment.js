import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    // Patient and Provider
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: "Patient",
      required: [true, "Patient reference is required"],
    },
    provider: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Healthcare provider is required"],
    },

    // Scheduling
    appointmentDate: {
      type: Date,
      required: [true, "Appointment date is required"],
    },
    appointmentTime: {
      start: {
        type: String,
        required: [true, "Start time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"],
      },
      end: {
        type: String,
        required: [true, "End time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"],
      },
    },
    duration: {
      type: Number,
      default: 30,
      min: 15,
    },

    // Appointment Details
    appointmentType: {
      type: String,
      enum: [
        "new_patient",
        "follow_up",
        "routine_checkup",
        "consultation",
        "emergency",
      ],
      required: [true, "Appointment type is required"],
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
    reasonForVisit: {
      type: String,
      required: [true, "Reason for visit is required"],
      trim: true,
    },

    // Status
    status: {
      type: String,
      enum: [
        "scheduled",
        "confirmed",
        "checked_in",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ],
      default: "scheduled",
    },

    // Check-in
    checkInTime: Date,
    actualStartTime: Date,
    actualEndTime: Date,

    // Notes
    notes: String,
    
    // Related Medical Record
    medicalRecord: {
      type: mongoose.Schema.ObjectId,
      ref: "MedicalRecord",
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
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ provider: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1 });

// Virtual for full date/time
appointmentSchema.virtual("fullDateTime").get(function () {
  if (!this.appointmentDate || !this.appointmentTime?.start) return null;
  
  const date = new Date(this.appointmentDate);
  const [hours, minutes] = this.appointmentTime.start.split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  
  return date;
});

// Virtual to check if today
appointmentSchema.virtual("isToday").get(function () {
  if (!this.appointmentDate) return false;
  const today = new Date();
  const appointmentDate = new Date(this.appointmentDate);
  return today.toDateString() === appointmentDate.toDateString();
});

// Instance methods
appointmentSchema.methods.checkIn = function () {
  this.status = "checked_in";
  this.checkInTime = new Date();
  return this.save();
};

appointmentSchema.methods.startAppointment = function () {
  this.status = "in_progress";
  this.actualStartTime = new Date();
  return this.save();
};

appointmentSchema.methods.completeAppointment = function (medicalRecordId) {
  this.status = "completed";
  this.actualEndTime = new Date();
  if (medicalRecordId) {
    this.medicalRecord = medicalRecordId;
  }
  return this.save();
};

// Static methods
appointmentSchema.statics.findByPatient = function (patientId) {
  return this.find({ patient: patientId })
    .populate("provider", "firstName lastName")
    .sort({ appointmentDate: 1 });
};

appointmentSchema.statics.findByProvider = function (providerId, date) {
  const query = { provider: providerId };
  if (date) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    query.appointmentDate = { $gte: startDate, $lt: endDate };
  }
  
  return this.find(query)
    .populate("patient", "firstName lastName patientId")
    .sort({ appointmentDate: 1, "appointmentTime.start": 1 });
};

appointmentSchema.statics.getTodaysAppointments = function () {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    appointmentDate: { $gte: today, $lt: tomorrow },
    status: { $nin: ["cancelled", "no_show"] },
  })
    .populate("patient provider")
    .sort({ "appointmentTime.start": 1 });
};

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;