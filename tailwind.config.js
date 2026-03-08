/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00BDD6",
          light: "#E6F4FE",
          dark: "#0891B2",
        },
        accent: {
          DEFAULT: "#FF6E71",
          gold: "#F59E0B",
          indigo: "#6366F1",
          emerald: "#10B981",
        },
        background: "#F8FAFB",
        surface: "#FFFFFF",
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        }
      },
      borderRadius: {
        '4xl': '32px',
        '5xl': '44px',
        '6xl': '56px',
      },
      boxShadow: {
        'premium': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'aqua': '0 20px 25px -5px rgba(0, 189, 214, 0.2), 0 10px 10px -5px rgba(0, 189, 214, 0.1)',
      }
    },
  },
  plugins: [],
}
