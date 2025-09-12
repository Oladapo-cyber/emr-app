import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { ROLES } from '../config/constants.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    // Create admin user with all required fields
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: ROLES.ADMIN,
      employeeId: 'ADM001',
      phone: '+2341234567890', // Required field
      isActive: true,
      department: 'administration',
      createdBy: null // First user, so no creator
    });

    console.log('Database seeded successfully');
    console.log('Admin credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
};

seedDatabase();