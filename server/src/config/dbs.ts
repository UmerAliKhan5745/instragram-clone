import mongoose from "mongoose";
// Import dotenv and configure it to load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.MONGO_URI )
const connectDB = async () => {
    try {
    const conn=  await mongoose.connect('mongodb://localhost:27017/Instrgram-clone');
      console.log(`MongoDB connected successfully  ${conn.connection.host}`);
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  };
  
  connectDB();