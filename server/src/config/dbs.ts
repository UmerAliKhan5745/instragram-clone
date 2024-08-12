import mongoose from "mongoose";
// Import dotenv and configure it to load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

console.log( )
const connectDB = async () => {
    try {
    const conn=  await mongoose.connect(process.env.MONGO_URI as string);
      console.log(`MongoDB connected successfully  ${conn.connection.host}`);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };
  
  connectDB();