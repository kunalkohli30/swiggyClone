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
      boxShadow: {
        '3xl': '0 0 5px #999'
      },
      aspectRatio: {
        '4/3': '5 / 3',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      screens: {
        'xs': '450px'
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        slideIn: "slideIn 0.2s ease-out forwards",
      },
    },
  },
  plugins: [],
}