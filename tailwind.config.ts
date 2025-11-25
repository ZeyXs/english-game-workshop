import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          'primary': '#f2c94c',      // Jaune doré
          'secondary': '#1f4e79',    // Bleu foncé
          'gray': '#bdbdbd',         // Gris clair
          'light': '#f1e9e2',        // Fond clair/crème
          'dark': '#343232',         // Noir/foncé
        }
      },
      fontFamily: {
        'display': ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-glacial)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'reveal': 'reveal 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'scale(0.8) rotateY(90deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotateY(0deg)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(52, 50, 50, 0.08)',
        'soft-lg': '0 8px 30px rgba(52, 50, 50, 0.12)',
        'primary': '0 4px 20px rgba(242, 201, 76, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config
