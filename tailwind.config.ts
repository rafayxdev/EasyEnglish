import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f2f8ff',
          100: '#dfeeff',
          200: '#c4defd',
          300: '#9ec8fb',
          400: '#6ea6f5',
          500: '#4f86eb',
          600: '#3669d6',
          700: '#2b52ad',
          800: '#2a468b',
          900: '#2a3d72',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.10)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
