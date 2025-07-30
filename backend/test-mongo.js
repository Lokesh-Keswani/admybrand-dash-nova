import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔗 Testing MongoDB Atlas connection...');
    console.log('🔗 MongoDB URI:', process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected successfully to:', conn.connection.host);
    console.log('✅ Database name:', conn.connection.name);
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ test: String });
    const TestModel = mongoose.model('Test', testSchema);
    
    const testDoc = new TestModel({ test: 'Connection test' });
    await testDoc.save();
    console.log('✅ Test document created successfully');
    
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('✅ Test document deleted successfully');
    
    await mongoose.disconnect();
    console.log('✅ MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

testConnection(); 