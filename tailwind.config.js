// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  darkMode: "",
  plugins: [require("flowbite/plugin")],
};
