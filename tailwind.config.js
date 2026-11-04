/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F0F7F4',
          100: '#D8ECE1',
          200: '#B7DEC9',
          300: '#8BC9AB',
          400: '#52B788',
          500: '#2D6A4F',
          600: '#1B4332',
          700: '#143527',
          800: '#0D241A',
          900: '#081C15',
        },
        limeAccent: {
          50: '#F4FBF4',
          100: '#E3F8E5',
          200: '#C7F1CC',
          300: '#9FE5A8',
          400: '#74D481',
          500: '#48BC58',
          600: '#339A41',
        },
        cream: {
          50: '#FDFDFB',
          100: '#FBFBF8',
          200: '#F4F5F0',
          300: '#ECEEE6',
          400: '#DFE2D5',
        },
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)',
        'soft-md': '0 6px 16px -4px rgba(15, 23, 42, 0.06), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        'soft-lg': '0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'glow-green': '0 0 20px -3px rgba(82, 183, 136, 0.35)',
      }
    },
  },
  plugins: [],
}
