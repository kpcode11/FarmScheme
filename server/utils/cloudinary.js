import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Ensure env vars are loaded before configuring Cloudinary (ESM imports run before app.js executes)
dotenv.config({ path: "./.env" });

// Validate environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Missing required Cloudinary environment variables: ${missingVars.join(', ')}`);
  console.error('Please check your .env file');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Log configuration status (without exposing secrets)
console.log('✅ Cloudinary configured for cloud:', process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET');

export { cloudinary };


