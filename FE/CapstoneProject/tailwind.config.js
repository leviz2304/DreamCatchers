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
const defaultTheme = require("tailwindcss/defaultTheme");
 
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
module.exports = withMT({
    content: ["./src/**/*.{js,jsx,ts,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@shadcn/ui/dist/**/*.{js,jsx}",
  ],
    theme: {
      extend: {
        animation: {
          scroll:
            "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        },
        colors: {
          'primary-100': '#FFEEE8',
          primary: "#FF7A59",
                secondary: "#7167FF",
                success: "#4CAF50",
                warning: "#FFC069",
        },
        keyframes: {
          scroll: {
            to: {
              transform: "translate(calc(-50% - 0.5rem))",
            },
          },
        },
      },
    },
    plugins: [addVariablesForColors],
  });
  function addVariablesForColors({ addBase, theme }) {
    const allColors = flattenColorPalette(theme("colors"));
    const newVars = Object.entries(allColors).reduce((acc, [key, val]) => {
      acc[`--${key}`] = val;
      return acc;
    }, {});
  
    addBase({
      ":root": newVars,
    });
  }
  