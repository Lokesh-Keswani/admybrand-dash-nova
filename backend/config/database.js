import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Mock user data for when MongoDB is not available
const mockUsers = [
  {
    _id: 'demo-user-id',
    name: 'Demo User',
    email: 'demo@admybrand.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8eO', // demo123
    role: 'admin',
    isActive: true,
    deletedAt: null,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock user methods
const createMockUser = (userData = null) => {
  if (userData) {
    // Return the actual user data with methods
    return {
      ...userData,
      comparePassword: async function(candidatePassword) {
        return candidatePassword === 'demo123' || candidatePassword === userData.password;
      },
      
      save: async function() {
        // Update the user in mock data
        const users = global.mockUsers || mockUsers;
        const index = users.findIndex(u => u._id === this._id);
        if (index !== -1) {
          users[index] = { ...this };
        } else {
          users.push({ ...this });
        }
        return this;
      }
    };
  }
  
  // Return demo user
  return {
    _id: 'demo-user-id',
    name: 'Demo User',
    email: 'demo@admybrand.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.i8eO', // demo123
    role: 'admin',
    isActive: true,
    deletedAt: null,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    
    // Mock methods
    comparePassword: async function(candidatePassword) {
      return candidatePassword === 'demo123';
    },
    
    save: async function() {
      // Update the user in mock data
      const users = global.mockUsers || mockUsers;
      const index = users.findIndex(u => u._id === this._id);
      if (index !== -1) {
        users[index] = { ...this };
      } else {
        users.push({ ...this });
      }
      return this;
    }
  };
};

// Mock User model for when MongoDB is not available
const createMockUserModel = () => {
  return {
    findByEmail: async (email) => {
      const users = global.mockUsers || mockUsers;
      const user = users.find(u => u.email === email.toLowerCase() && !u.deletedAt);
      if (user) {
        return createMockUser(user);
      }
      return null;
    },
    
    findByEmailIncludingDeleted: async (email) => {
      const users = global.mockUsers || mockUsers;
      const user = users.find(u => u.email === email.toLowerCase());
      if (user) {
        return createMockUser(user);
      }
      return null;
    },
    
    findById: async (id) => {
      const users = global.mockUsers || mockUsers;
      const user = users.find(u => u._id === id && !u.deletedAt);
      if (user) {
        return createMockUser(user);
      }
      return null;
    }
  };
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admybrand';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Create demo user if it doesn't exist
    await createDemoUser();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('🔄 Falling back to mock database for demo purposes...');
    
    // Set up mock User model
    global.MockUser = createMockUserModel();
    
    // Create demo user in mock data
    if (!mockUsers.find(u => u.email === 'demo@admybrand.com')) {
      mockUsers.push(createMockUser());
      console.log('✅ Demo user created in mock database: demo@admybrand.com / demo123');
    } else {
      console.log('✅ Demo user already exists in mock database: demo@admybrand.com / demo123');
    }
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