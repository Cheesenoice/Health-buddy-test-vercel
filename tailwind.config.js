/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        zalo: {
          primary: "#0068FF",
          bg: "#F2F4F7",
        },
      },
    },
  },
  plugins: [],
};
