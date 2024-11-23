/** @type {import('tailwindcss').Config} */
module.exports = {  
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '576px',
      // => @media (min-width: 576px) { ... }
      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '992px',
      // => @media (min-width: 992px) { ... }

      'xl': '1300px',
      // => @media (min-width: 1200px) { ... }

      'xxl': '1365px',
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false // <== disable this!
  },
}

