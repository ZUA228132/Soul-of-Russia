import React from 'react'
import Navbar from './Navbar.jsx'
import Hero from './Hero.jsx'

export default function App() {
  return (
    <div className="min-h-screen">
      <div className="bg-grid bg-grid"></div>
      <Navbar/>
      <main className="max-w-7xl mx-auto px-4">
        <Hero/>
      </main>
    </div>
  )
}
