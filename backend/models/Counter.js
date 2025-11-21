import mongoose from "mongoose";

/**
 * Counter Model for Atomic Sequence Generation
 * Prevents race conditions when generating sequential IDs
 * Used by: Patient, Invoice, Appointment, etc.
 */
const counterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      // Examples: "patient_2024", "invoice_2024", "appointment_2024"
    },
    seq: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    lastReset: {
      type: Date,
      default: Date.now,
      // Track when counter was last reset (useful for annual resets)
    },
  },
  {
    timestamps: true,
  }
);

// Index already defined with unique: true in schema field
// counterSchema.index({ name: 1 }, { unique: true });

/**
 * Static method to get next sequence number atomically
 * This is the core function that prevents race conditions
 * 
 * @param {string} counterName - Name of the counter (e.g., "patient_2024")
 * @returns {Promise<number>} - Next sequence number
 */
counterSchema.statics.getNextSequence = async function (counterName) {
  // findOneAndUpdate is ATOMIC - MongoDB handles concurrency internally
  const counter = await this.findOneAndUpdate(
    { name: counterName },           // Find counter by name
    { $inc: { seq: 1 } },           // Atomically increment sequence
    {
      new: true,                    // Return updated document
      upsert: true,                 // Create if doesn't exist
      setDefaultsOnInsert: true,    // Use schema defaults on creation
    }
  );

  return counter.seq;
};

/**
 * Static method to reset counter (useful for new year)
 * 
 * @param {string} counterName - Name of the counter to reset
 * @returns {Promise<Object>} - Reset counter document
 */
counterSchema.statics.resetCounter = async function (counterName) {
  return this.findOneAndUpdate(
    { name: counterName },
    { 
      seq: 0,
      lastReset: new Date(),
    },
    {
      new: true,
      upsert: true,
    }
  );
};

/**
 * Static method to get current sequence without incrementing
 * 
 * @param {string} counterName - Name of the counter
 * @returns {Promise<number>} - Current sequence number
 */
counterSchema.statics.getCurrentSequence = async function (counterName) {
  const counter = await this.findOne({ name: counterName });
  return counter ? counter.seq : 0;
};

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;