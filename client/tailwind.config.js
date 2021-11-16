const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: '#cdd6d0',
      gray:  '#24282e',
      primary: '#07174b',
      accent: '#ffa770',
      accent2: '#ffc099',
      secondary: '#1252a5',
      tirsh: '#091C5D'
    },
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['disabled'],
      opacity: ['disabled'],
    },
  },
  plugins: [],
}
