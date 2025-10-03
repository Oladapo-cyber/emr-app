import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
  const startTime = Date.now();
  
  try {
    // Test database connection
    const dbStatus = await testDatabaseConnection();
    
    const healthcheck = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      responseTime: Date.now() - startTime,
      database: dbStatus,
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      environment: process.env.NODE_ENV || 'development'
    };

    res.status(200).json({
      success: true,
      message: 'System is healthy',
      data: healthcheck
    });

  } catch (error) {
    //Catch will trigger if database test fails
    res.status(503).json({
      success: false,
      message: 'System health check failed',
      error: error.message,
      data: {
        uptime: process.uptime(),
        timestamp: Date.now(),
        database: 'error',
        environment: process.env.NODE_ENV || 'development'
      }
    });
  }
});

// Helper function to test database
async function testDatabaseConnection() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected');
  }

  await mongoose.connection.db.admin().ping();
  return 'healthy';
}

export default router;