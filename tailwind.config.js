/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        syne: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Nunito', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        green: {
          950: '#020c05',
          900: '#041209',
        }
      }
    },
  },
  plugins: [],
};
