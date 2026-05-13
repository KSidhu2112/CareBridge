import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is not defined in .env file");
    }
    
    // Log the connection attempt (redacting credentials)
    const host = uri.split('@')[1] || "Local/Unknown";
    console.log(`📡 Attempting to connect to: ${host.split('/')[0]}`);
    
    try {
        // Option 1: Attempt Cloud connection
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000, // Increase timeout to 10s
        });
        console.log(`🚀 MongoDB Connected (Cloud): ${conn.connection.host}`);
    } catch (cloudError) {
        console.error(`⚠️ Cloud MongoDB failed: ${cloudError.message}`);
        console.log(`🏠 Attempting fallback to local MongoDB...`);
        
        // Option 2: Fallback to Local (ensure your local MongoDB is running)
        const localUri = "mongodb://127.0.0.1:27017/mern_project";
        const conn = await mongoose.connect(localUri);
        console.log(`🚀 MongoDB Connected (Local): ${conn.connection.host}`);
    }
  } catch (error) {
    console.error(`❌ ERROR: Could not connect to any MongoDB instance.`);
    console.error(`Reason: ${error.message}`);
    console.log("Please ensure either your Internet connection is working (for Cloud) or Local MongoDB service is running.");
    process.exit(1);
  }
};

export default connectDB;
