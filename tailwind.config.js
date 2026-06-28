/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1a3a6b',
        'navy-dark': '#122d55',
        'irctc-orange': '#f97316',
        'irctc-bg': '#f0f2f5',
      },
      fontFamily: {
        sans: ["'Segoe UI'", 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
