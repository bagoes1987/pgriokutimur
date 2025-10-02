/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        pgri: {
          red: '#E53E3E',
          'red-dark': '#C53030',
          'red-light': '#FC8181',
          green: '#38A169',
          'green-dark': '#2F855A',
          'green-light': '#68D391',
          yellow: '#F6E05E',
          'yellow-dark': '#D69E2E',
          'yellow-light': '#F6E05E',
          white: '#FFFFFF',
          gray: '#718096',
          'gray-dark': '#4A5568',
          'gray-light': '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}