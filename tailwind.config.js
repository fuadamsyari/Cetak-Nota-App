/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', './src/script.js'],
  theme: {
    extend: {
      fontFamily: {
        LecekerliOne: ['Leckerli One', 'cursive'],
      },
      width: {
        wadah: ['1250px'],
        a4: ['794px'],
      },
    },
  },
  plugins: [],
};
