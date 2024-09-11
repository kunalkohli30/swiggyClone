/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'display': ['Poppins'],
      'cabin': ['Cabin'],
      'roboto': ['Roboto']
    },
    extend: {
      aspectRatio: {
        '4/3': '5 / 3',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}