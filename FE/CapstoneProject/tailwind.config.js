/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

// module.exports = {
//     content: [
//         "./src/**/*.{js,jsx,ts,tsx}",
//         "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
//     ],
//     theme: {
//         extend: {},
//     },
//     plugins: [
       

//     ],
// };
module.exports = withMT({
    content: ["./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          'primary-100': '#FFEEE8',
          primary: "#FF7A59",
                secondary: "#7167FF",
                success: "#4CAF50",
                warning: "#FFC069",
        },
      },
    },
    plugins: [],
  });