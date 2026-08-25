import mongoose from 'mongoose';
import { autoSeed } from '../utils/autoSeed.js';

let mongod = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cars-build';
  
  try {
    // Attempt standard MongoDB connection with a 3.5s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500
    });
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    await autoSeed();
  } catch (error) {
    console.warn(`⚠️ Could not connect to MongoDB at ${uri} (${error.message}).`);
    console.log('⚡ Initializing Embedded In-Memory MongoDB Server for full zero-config operation...');
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`✅ Embedded In-Memory MongoDB Connected: ${memoryUri}`);
      await autoSeed();
    } catch (memError) {
      console.error(`❌ In-memory MongoDB failed to start: ${memError.message}`);
      console.error('Please ensure MongoDB is running or MongoMemoryServer has network access.');
    }
  }
};

// Graceful cleanup
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
  process.exit(0);
});
