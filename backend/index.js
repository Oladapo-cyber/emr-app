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
import healthRoutes from "./routes/health.js"; 
import mongoose from "mongoose";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { authLimiter, apiLimiter } from './middlewares/rateLimiter.js';

dotenv.config();

const app = express();
 
// ✅ FIXED: Properly configured CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or same-origin)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5173',
      'http://localhost:5174', // Backup Vite ports
      'http://127.0.0.1:5173'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours - cache preflight requests
};


// Global CORS - handles all requests including OPTIONS preflight
app.use(cors(corsOptions));

// Other middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes with rate limiting
app.use("/api/health", healthRoutes);
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/patients", apiLimiter, patientRoutes);
app.use("/api/appointments", apiLimiter, appointmentRoutes);
app.use("/api/medicalRecords", apiLimiter, medicalRecordRoutes);
app.use("/api/staff", apiLimiter, staffRoutes);

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
