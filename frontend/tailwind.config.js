/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
      },
      colors: {
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
        },
        brand: {
          DEFAULT: "#1c1917",
          light: "#44403c",
        },
        accent: {
          DEFAULT: "#c2410c",
          light: "#ea580c",
          pale: "#fff7ed",
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        "slide-in": "slideIn 0.35s ease forwards",
        "toast-in": "toastIn 3s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(20px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        toastIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "10%, 80%": { opacity: 1, transform: "translateY(0)" },
          "100%": { opacity: 0, transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};
