/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure this line is exactly like this
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        accent: "#2563eb",
      },
    },
  },
  plugins: [],
}