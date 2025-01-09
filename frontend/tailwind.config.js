/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        itim: ['Itim', 'sans-serif'], // เพิ่มฟอนต์ Itim
        smath : ['sMath-cmbx10', 'serif']
      },
    },
  },
  plugins: [
    require('daisyui'),
  ]
}

