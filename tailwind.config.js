/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: '#d4af37',
        ink: '#0d0f12',
        panel: '#15181d',
        fog: '#a0a3ad'
      },
      boxShadow: {
        glow: '0 0 40px rgba(212,175,55,0.25)',
        innerSoft: 'inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.4)'
      },
      backgroundImage: {
        'gradient-title': 'linear-gradient(90deg, #f59f9f, #e879f9, #f59e0b)',
        'panel': 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.00))',
        'grid': 'radial-gradient(transparent 1px, rgba(255,255,255,0.03) 1px)'
      },
      backgroundSize: {
        'grid': '16px 16px'
      },
      borderRadius: {
        'xl2': '1.25rem'
      }
    }
  },
  plugins: []
}
