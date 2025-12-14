/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#005461',   // Deep Background
          mid: '#018790',    // Secondary/Cards
          light: '#00B7B5',  // Accents/Buttons
          white: '#F4F4F4',  // Text
        }
      },
      fontFamily: {
        // Optional: If you want a more "tech" font, add one here later
      }
    },
  },
  plugins: [],
}