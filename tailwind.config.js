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
        dark: {
          bg: "#000000",
          surface: "#1a1a1a",
          card: "#2a2a2a",
          border: "#3a3a3a",
          text: "#ffffff",
          textSecondary: "#a0a0a0",
        },
      },
    },
  },
  plugins: [],
};
