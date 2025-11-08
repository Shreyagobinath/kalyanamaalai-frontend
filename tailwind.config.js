/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366F1", // Indigo 500
          light: "#A5B4FC",
          dark: "#4F46E5",
        },
        accent: {
          pink: "#EC4899",
          green: "#10B981",
        },
        neutral: {
          light: "#F9FAFB",
          mid: "#E5E7EB",
          dark: "#374151",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px rgba(99, 102, 241, 0.08)",
        medium: "0 4px 25px rgba(99, 102, 241, 0.15)",
      },
    },
  },
  plugins: [],
};
