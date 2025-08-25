import multer from 'multer';  // File upload middleware for Express
import path from 'path';     // Node.js built-in for file paths
import crypto from 'crypto'; // Node.js built-in for generating random strings

// STORAGE CONFIGURATION
// multer.diskStorage() creates a storage engine that saves files to disk
const storage = multer.diskStorage({
  
  // WHERE to save files
  destination: (req, file, cb) => {
    // cb = callback function (error, destination)
    // null = no error, 'uploads/medical-records' = folder path 
    cb(null, 'uploads/medical-records');
  },
  
  // HOW to name the files
  filename: (req, file, cb) => {
    // Generate unique random string (32 characters)
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    
    // Create filename: timestamp-randomstring.originalextension
    // Example: 1640995200000-a1b2c3d4e5f6.pdf
    const newFilename = `${Date.now()}-${uniqueSuffix}${path.extname(file.originalname)}`;
    
    cb(null, newFilename);
  }
});

// MULTER CONFIGURATION
export const uploadMedicalFile = multer({
  storage: storage, // Use custom storage config above
  
  // FILE SIZE LIMITS
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB in bytes (5 × 1024 × 1024)
    // 1024 bytes = 1KB, 1024KB = 1MB, so 5MB = 5,242,880 bytes
  },
  
  // FILE TYPE FILTERING
  fileFilter: (req, file, cb) => {
    // Define allowed file extensions using regex
    const allowedTypes = /jpeg|jpg|png|pdf/;
    
    // Check file extension (from filename)
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    
    // Check MIME type (from file headers)
    const mimetype = allowedTypes.test(file.mimetype);
    
    // Both extension AND mimetype must match (security measure)
    if (extname && mimetype) {
      return cb(null, true);  // Accept file
    }
    
    // Reject file with error message
    cb(new Error('Invalid file type. Only JPEG, PNG and PDF allowed.'));
  }
}); 