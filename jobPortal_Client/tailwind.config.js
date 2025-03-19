/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {},
    },
    plugins: [require("daisyui")], // Ensure DaisyUI is loaded properly
  
    daisyui: {
      themes: ["light"], // Set default theme to light
    },
  };
  