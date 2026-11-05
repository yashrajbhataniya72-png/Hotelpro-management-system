import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n❌ [MongoDB Connection Error]: ${error.message}`);
    console.error('👉 Make sure MongoDB is installed and running on your computer!');
    console.error('👉 Tip for Windows: Open Services (services.msc) and Start "MongoDB Server", or open CMD as Admin and run: net start MongoDB\n');
  }
};

export default connectDB;
