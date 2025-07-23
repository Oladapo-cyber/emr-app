import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/database.js";
import winston from "./utils/logger.js";
import patientRoutes from "./routes/patients.js";
import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import medicalRecordRoutes from "./routes/medicalRecords.js";
import staffRoutes from "./routes/staff.js";
import mongoose from "mongoose";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medicalRecords", medicalRecordRoutes);
app.use("/api/staff", staffRoutes);

// 404 Not Found Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Start the server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 8080;
    const server = app.listen(PORT, () => {
      winston.info(`🚀 Server running on port ${PORT}`);
      winston.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // PROPER SOLUTION: Single point of cleanup, use 'once' to prevent duplicates
    const gracefulShutdown = async (signal) => {
      winston.info(`${signal} received. Shutting down gracefully...`);

      server.close(async () => {
        try {
          await mongoose.connection.close();
          winston.info("MongoDB connection closed");
          winston.info("Process terminated gracefully");
          process.exit(0);
        } catch (error) {
          winston.error("Error during shutdown:", error);
          process.exit(1);
        }
      });
    };

    // Use 'once' instead of 'on' to prevent duplicate listeners
    process.once("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.once("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    winston.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
