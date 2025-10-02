/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#6366f1',
          600: '#585AE6',
          700: '#4f46e5',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
      },
    },
  },
  plugins: [],
};


