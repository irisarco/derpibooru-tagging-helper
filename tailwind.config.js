/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: "verdana,arial,helvetica,sans-serif",
    },
    extend: {
      spacing: {
        "5px": "5px",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss"), require("@tailwindcss/forms")],
};
