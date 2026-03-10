/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        pulseSoft: 'pulseSoft 1s ease-in-out 2',
        floaty: 'floaty 2s ease-in-out infinite',
        diceRoll: 'diceRoll 0.8s ease-in-out',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        diceRoll: {
          '0%': { transform: 'rotate(0deg)' },
          '35%': { transform: 'rotate(130deg) scale(1.12)' },
          '75%': { transform: 'rotate(290deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}
