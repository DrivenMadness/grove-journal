/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cooler blue-green forest (dawn clearing, not night)
        grove: {
          50: '#e8f2f0',
          100: '#d1e6e2',
          200: '#a3cdc5',
          300: '#6ba89e',
          400: '#4d8a82',
          500: '#3d6e68',
          600: '#2d5652',
          700: '#23443f',
          800: '#1a332f',
          900: '#0f2422',
          950: '#081816',
        },
        earth: {
          50: '#f5f4f0',
          100: '#e8e4d8',
          200: '#d0c8b0',
          300: '#b5a67a',
          400: '#9a8852',
          500: '#7e6e3a',
          600: '#63562e',
          700: '#4a4024',
          800: '#332c1a',
          900: '#1f1a10',
        },
        mist: {
          50: '#f0f6f8',
          100: '#e2ecf0',
          200: '#c5d9e2',
          300: '#9bbdd0',
          400: '#7a9fb5',
          500: '#5a7f94',
        },
        // Water & waterfall — prominent, serene
        water: {
          100: '#d4eef2',
          200: '#a8dce6',
          300: '#7ac5d4',
          400: '#5aadc2',
          500: '#3d8fa3',
          600: '#2d6e7e',
          700: '#1e4d5a',
        },
        // Soft blue-white for mist, waterfall highlight, foam
        'water-mist': '#e8f4f8',
        'water-glow': 'rgba(200, 230, 240, 0.4)',
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
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.9' },
        },
        ripple: {
          '0%, 100%': { transform: 'translateX(0) scaleX(1)' },
          '50%': { transform: 'translateX(4%) scaleX(1.03)' },
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
