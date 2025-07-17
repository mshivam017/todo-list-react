# To Quick Start
npm install
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install -D @tailwindcss/postcss
npm install -D style-loader css-loader postcss-loader
npm start


# To Build apk
# Install Capacitor CLI and core packages:
npm install @capacitor/core @capacitor/cli
npx cap init
# This will create a capacitor.config.ts file in the root directory
# Add the Android and iOS platforms to your project:
npm install @capacitor/android @capacitor/ios
npm run build
npx cap sync  
npx cap open android
# or
npx cap open ios

# Conclusion: This guide has provided a detailed walkthrough of converting a React app to native Android and iOS apps using Capacitor.js. By following these steps, you can extend your React web application to both Android and iOS platforms with ease. Capacitor.js enables you to leverage your existing web development skills to create powerful, native mobile applications.

# Tailwind Configure
File = tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",  // Include all your React files
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }

# CSS import
File = postcss.config.js
// postcss.config.js
module.exports = {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  };
  
# index.css 
@tailwind base;
@tailwind components;
@tailwind utilities;
