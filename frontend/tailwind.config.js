/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc',
        surface: '#ffffff',
        primary: {
          DEFAULT: '#0f766e', // teal-700
          dark: '#115e59',
          light: '#ccfbf1',
        },
        secondary: {
          DEFAULT: '#334155', // slate-700
          dark: '#1e293b',
          light: '#f1f5f9',
        },
        accent: {
          DEFAULT: '#0369a1', // sky-700
        },
        danger: '#dc2626',
        warning: '#d97706',
        success: '#16a34a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
