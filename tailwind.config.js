/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { gold: '#d4af37', ink: '#121317', fog: '#a0a3ad' },
      boxShadow: { glow: '0 0 40px rgba(212,175,55,0.25)' },
      backgroundImage: {
        'hero': 'radial-gradient(1000px 500px at 10% -10%, rgba(212,175,55,0.2), transparent), radial-gradient(800px 600px at 90% -20%, rgba(255,255,255,0.08), transparent)',
        'noise': 'url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%27120%27 height=%27120%27><filter id=%27n%27><feTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27 stitchTiles=%27stitch%27/></filter><rect width=%27100%%27 height=%27100%%27 filter=%27url(%23n)%27 opacity=%270.04%27/></svg>")'
      }
    },
  },
  plugins: [],
}
