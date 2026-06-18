/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#DDECEF',
        shell: '#EAF7FB',
        panel: '#FFFFFF',
        ink: '#111719',
        muted: '#747B82',
        line: '#D9E8EC',
        brand: '#14B8A6',
        brandDark: '#0F766E',
        sidebar: '#F7FBFC',
        sidebarSoft: '#EFF6F8',
        aqua: '#DFF5F4',
        amber: '#F59E0B',
      },
      boxShadow: {
        soft: '0 18px 42px rgba(17, 23, 25, 0.08)',
        card: '0 10px 24px rgba(17, 23, 25, 0.035)',
      },
    },
  },
  plugins: [],
};
