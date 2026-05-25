const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    }

    throw new Error('MONGODB_URI is not defined');
  } catch (error) {
    console.warn(`MongoDB connection failed: ${error.message}`);

    if (process.env.NODE_ENV === 'production') {
      console.error('Production MongoDB connection required. Exiting.');
      process.exit(1);
    }

    const mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();

    try {
      const conn = await mongoose.connect(memoryUri);
      console.log(`Connected to in-memory MongoDB: ${conn.connection.host}`);
    } catch (memoryError) {
      console.error(`In-memory MongoDB connection failed: ${memoryError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
