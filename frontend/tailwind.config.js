/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F8FB',
        panel: '#FFFFFF',
        ink: '#161719',
        muted: '#68707D',
        line: '#DDE2EA',
        brand: '#0E7C66',
        brandDark: '#075E4D',
        amber: '#B7791F',
      },
      boxShadow: {
        soft: '0 16px 40px rgba(22, 23, 25, 0.08)',
      },
    },
  },
  plugins: [],
};
