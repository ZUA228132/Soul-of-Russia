/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { gold:'#d4af37', twitch:'#9146FF' },
      boxShadow: { innerSoft:'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)' },
      backgroundImage: {
        'gradient-title':'linear-gradient(90deg,#f59f9f,#e879f9,#f59e0b)'
      }
    }
  },
  plugins: []
}
