import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );
    console.log(
      `\n MongoDB connected! DB host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Error Connecting to database", error);
    process.exit(1);
  }
};

export default connectDB;
