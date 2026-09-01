/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: '#000000',
          night: '#050509',
          surface: '#0a0a14',
          surfaceLight: '#14152a',
          border: '#23284a',
          blue: {
            50: '#eaf1ff',
            100: '#cddeff',
            200: '#9bbcff',
            300: '#5f92ff',
            400: '#2668ff',
            500: '#0044ff',
            600: '#0036cc',
            700: '#002999',
            800: '#001c66',
            900: '#001440',
            950: '#000a24',
          },
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(38, 104, 255, 0.4), 0 0 44px -6px rgba(0, 68, 255, 0.75)',
        'glow-lg': '0 0 0 1px rgba(38, 104, 255, 0.45), 0 0 80px -8px rgba(0, 68, 255, 0.85)',
        'glow-white': '0 0 0 1px rgba(255, 255, 255, 0.5), 0 0 24px -4px rgba(255, 255, 255, 0.35)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at 18% 15%, rgba(0,68,255,0.55), transparent 55%), radial-gradient(circle at 85% 85%, rgba(38,104,255,0.28), transparent 50%)',
      },
    },
  },
  plugins: [],
};
