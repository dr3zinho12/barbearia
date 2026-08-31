/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#04070d',
          night: '#080c16',
          surface: '#0d1220',
          surfaceLight: '#141a2c',
          border: '#1f2740',
          blue: {
            50: '#eef4ff',
            100: '#d9e6ff',
            200: '#b3ccff',
            300: '#82abff',
            400: '#4f83ff',
            500: '#2f61f2',
            600: '#1f47d1',
            700: '#1a39a6',
            800: '#182f80',
            900: '#162a63',
            950: '#0d1740',
          },
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(79, 131, 255, 0.15), 0 8px 30px -4px rgba(47, 97, 242, 0.35)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at 20% 20%, rgba(47,97,242,0.28), transparent 55%)',
      },
    },
  },
  plugins: [],
};
