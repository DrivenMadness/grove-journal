/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        grove: {
          50: '#f0f5f0',
          100: '#dce8dc',
          200: '#b8d4b8',
          300: '#8bba8b',
          400: '#5a9a5a',
          500: '#3d7a3d',
          600: '#2d5e2d',
          700: '#234a23',
          800: '#1a361a',
          900: '#0f220f',
          950: '#081408',
        },
        earth: {
          50: '#faf6f1',
          100: '#f0e6d8',
          200: '#e0ccb0',
          300: '#c9a87a',
          400: '#b08a52',
          500: '#96703a',
          600: '#7a5a2e',
          700: '#5e4524',
          800: '#43311a',
          900: '#2a1f10',
        },
        mist: {
          50: '#f5f7f5',
          100: '#e8ede8',
          200: '#d0dbd0',
          300: '#a8bda8',
          400: '#7a9a7a',
          500: '#5a7a5a',
        },
        water: {
          300: '#93c5c5',
          400: '#6ba8a8',
          500: '#4a8a8a',
          600: '#356a6a',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        ui: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'drift': 'drift 20s ease-in-out infinite',
        'drift-slow': 'drift 30s ease-in-out infinite reverse',
        'float': 'float 6s ease-in-out infinite',
        'mist': 'mist 15s ease-in-out infinite',
        'water-flow': 'waterFlow 8s ease-in-out infinite',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'breathe': 'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(20px) translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        mist: {
          '0%, 100%': { opacity: '0.3', transform: 'translateX(-5%)' },
          '50%': { opacity: '0.6', transform: 'translateX(5%)' },
        },
        waterFlow: {
          '0%, 100%': { transform: 'translateX(-2%) scaleY(1)' },
          '50%': { transform: 'translateX(2%) scaleY(1.02)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
