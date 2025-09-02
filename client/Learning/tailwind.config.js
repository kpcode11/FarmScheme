/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure this line includes your component files
    "node_modules/flowbite-react/lib/esm/**/*.js", // Path for Flowbite components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // require('flowbite/plugin'), // Your existing Flowbite plugin
    // require('daisyui'),        // Add the daisyUI plugin here
    "daisyui",
  ],
};
