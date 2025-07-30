import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admybrand';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create demo user if it doesn't exist
    await createDemoUser();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Create a demo user for testing
const createDemoUser = async () => {
  try {
    // Import User model
    const { default: User } = await import('../models/User.js');
    
    // Check if demo user already exists and is not deleted
    const existingDemo = await User.findByEmailIncludingDeleted('demo@admybrand.com');
    
    if (!existingDemo || existingDemo.deletedAt) {
      const demoUser = new User({
        name: 'Demo User',
        email: 'demo@admybrand.com',
        password: 'demo123', // Will be hashed automatically
        role: 'admin'
      });
      
      await demoUser.save();
      console.log('✅ Demo user created: demo@admybrand.com / demo123');
    } else {
      console.log('✅ Demo user already exists: demo@admybrand.com / demo123');
    }
  } catch (error) {
    console.error('❌ Error creating demo user:', error.message);
  }
};

export default connectDB; 