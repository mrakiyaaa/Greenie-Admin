/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        textGray: '#585656',
        primaryGreen: '#1BAC5F',
        white: '#FFFFFF',
        red: '#E15959',
        outlineGray: '#DBDBDB',
        bgLightGray: '#F8F8F8',
      },
    },
  },
  plugins: [],
};
