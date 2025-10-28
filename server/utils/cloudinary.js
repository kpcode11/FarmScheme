import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Ensure env vars are loaded before configuring Cloudinary (ESM imports run before app.js executes)
dotenv.config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };


