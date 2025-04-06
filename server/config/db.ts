import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const db = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string)
    console.log("✅ Database is connected successfully");
  } catch (err) {
    console.error("❌ Problem in connecting to database:", err);
    process.exit(1); // Exit process with failure
  }
};

export default db;
