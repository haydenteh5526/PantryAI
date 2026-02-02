/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#84A98C", // Sage Green
        secondary: "#E5989B", // Terra Cotta
        background: "#F8F9FA", // Oat Milk - Off White
        surface: "#FFFFFF", // Pure White
        text: "#2F3E46", // Charcoal
        danger: "#E76F51", // Burnt Orange
        muted: "#CAD2C5", // Light Sage
        accent: "#52796F", // Deep Sage
      },
    },
  },
  plugins: [],
};
