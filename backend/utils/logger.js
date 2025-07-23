//Logger to handle different log levels and formats
import winston from "winston";

const logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(), // Output logs to the console
    new winston.transports.File({ filename: "logs/error.log", level: "error" }), // Errors only
    new winston.transports.File({ filename: "logs/combined.log" }), // All logs
  ],
});

export default logger;
