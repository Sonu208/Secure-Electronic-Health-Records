/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        "custom-teal": "#00adb5",
      },
      textColor: {
        "custom-blue": "#CDF5FD", // Add your hex code here
      },
    },
  },
  plugins: [],
};
