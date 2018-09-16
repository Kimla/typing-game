/* eslint-disable */
const { join } = require('path');
const tailwindJS = join(__dirname, 'tailwind.js');

module.exports = {
    plugins: [require('tailwindcss')(tailwindJS), require('autoprefixer')],
};
