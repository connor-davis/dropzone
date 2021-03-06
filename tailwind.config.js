const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        currentColor: 'currentColor',
        red: colors.red,
        black: '#181818',
        white: colors.white,
        gray: colors.trueGray,
      },
      fontSize: {
        xss: '.65rem',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
