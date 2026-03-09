/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0288D1", // Deep Blue - Main theme
          deep: "#0288D1",
          cyan: "#00BCD4", // Cyan / Aqua
          light: "#4FC3F7", // Light Blue
        },
        success: {
          DEFAULT: "#66BB6A",
          light: "#A5D6A7",
        },
        warning: {
          DEFAULT: "#FFA726", // Orange
        },
        error: {
          DEFAULT: "#F44336", // Red
        },
        background: "#FFFFFF",
        surface: "#F5F5F5", // Light Gray Card Background
        "surface-dark": "#E0E0E0",
        text: {
          DEFAULT: "#212121", // Dark Gray Main
          medium: "#757575", // Medium Gray
          white: "#FFFFFF",
        },
        dark: {
          background: "#0F172A",
          surface: "#1E293B",
          text: "#F8FAFC",
          accent: "#00BCD4",
        },
      },
      borderRadius: {
        '4xl': '32px',
        '5xl': '44px',
        '6xl': '56px',
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'aqua': '0 20px 25px -5px rgba(0, 188, 212, 0.3), 0 10px 10px -5px rgba(0, 188, 212, 0.2)',
        'deep': '0 20px 25px -5px rgba(2, 136, 209, 0.3), 0 10px 10px -5px rgba(2, 136, 209, 0.2)',
      }
    },
  },
  plugins: [],
}
