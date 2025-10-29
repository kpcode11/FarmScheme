import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

console.log('Testing Cloudinary Configuration...\n');

// Check if environment variables are set
console.log('Environment Variables:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Not Set');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Set' : '❌ Not Set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Set' : '❌ Not Set');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('\nTesting connection to Cloudinary...');

// Test the connection
cloudinary.api.ping()
  .then(result => {
    console.log('\n✅ SUCCESS! Cloudinary connection is working!');
    console.log('Response:', result);
  })
  .catch(error => {
    console.error('\n❌ FAILED! Cloudinary connection error:');
    console.error('Error message:', error.message);
    console.error('\nPossible issues:');
    console.error('1. Check if your credentials in .env file are correct');
    console.error('2. Make sure there are no extra spaces in your .env values');
    console.error('3. Verify your internet connection');
    console.error('4. Check if your Cloudinary account is active');
  });
