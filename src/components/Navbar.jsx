import React from 'react'
import { motion } from 'framer-motion'

const IconBtn = ({children, title}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    title={title}
    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
    {children}
  </motion.button>
)

export default function Navbar({ cartCount=0 }) {
  return (
    <header className="sticky top-0 z-40 bg-ink/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <motion.div whileHover={{ rotate: -6 }} className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold">ДР</motion.div>
        <div className="leading-tight select-none">
          <div className="font-semibold">Душа Руси</div>
          <div className="text-xs text-fog tracking-wide">ФУТБОЛКИ</div>
        </div>

        <div className="flex-1"></div>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
          <div className="flex items-center gap-2 flex-1 px-3 h-10 rounded-xl bg-white/5 border border-white/10">
            <span className="text-fog">🔎</span>
            <input placeholder="Поиск по коллекции" className="bg-transparent outline-none flex-1 text-sm placeholder:text-fog/70"/>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconBtn title="Тема">🌞</IconBtn>
          <IconBtn title="Настройки">⚙️</IconBtn>
          <motion.button whileHover={{ scale: 1.05 }} onClick={()=>location.hash='#cart'} className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
            <span className="absolute -top-1 -right-1 text-[10px] bg-gold text-ink rounded-full px-1.5 py-0.5">{cartCount}</span>
            🧺
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} onClick={()=>location.hash='admin'} className="hidden md:inline-flex btn btn-ghost">Админка</motion.button>
        </div>
      </div>
    </header>
  )
}
