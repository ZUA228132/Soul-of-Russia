import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IconBtn = ({children, title, onClick}) => (
  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }} title={title} onClick={onClick}
    className="w-10 h-10 rounded-xl btn-ghost flex items-center justify-center">
    {children}
  </motion.button>
)

export default function Navbar({ cartCount=0 }) {
  const [theme, setTheme] = useState('dark')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    const t = saved || sys
    setTheme(t)
    document.body.classList.toggle('theme-light', t === 'light')
    const meta = document.querySelector('#theme-color-meta')
    meta?.setAttribute('content', t==='light' ? '#f7f7f8' : '#0d0f12')
  }, [])

  const toggleTheme = () => {
    const t = theme === 'light' ? 'dark' : 'light'
    setTheme(t); localStorage.setItem('theme', t)
    document.body.classList.toggle('theme-light', t === 'light')
    document.querySelector('#theme-color-meta')?.setAttribute('content', t==='light' ? '#f7f7f8' : '#0d0f12')
  }

  return (
    <header className="sticky top-0 z-40 safe-header" style={{backdropFilter:'blur(10px)'}}>
      <div className="section py-3 flex items-center gap-3 border-b" style={{borderColor:'var(--border)'}}>
        <div className="w-9 h-9 rounded-xl btn-ghost flex items-center justify-center font-bold"><button onClick={()=>{ if (history.length>1) history.back(); else location.hash="" }} className="w-full h-full">ДР</button></div>
        <div className="leading-tight select-none">
          <div className="font-semibold">Душа Руси</div>
          <div className="text-xs text-muted tracking-wide">ФУТБОЛКИ</div>
        </div>
        <div className="flex-1"></div>
        <IconBtn title="Тема" onClick={toggleTheme}>{theme==='light'?'🌞':'🌙'}</IconBtn>
                <motion.button whileHover={{ scale: 1.04 }} onClick={()=>location.hash='#cart'} className="relative w-10 h-10 rounded-xl btn-ghost">
          <span className="absolute -top-1 -right-1 text-[10px] bg-gold text-black rounded-full px-1.5 py-0.5">{cartCount}</span>🧺
        </motion.button>
      </div>

      {/* Bottom sheet menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50" onClick={()=>setOpen(false)}>
            <div className="absolute inset-0 bg-black/40"></div>
            <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring', stiffness:260, damping:24}}
              className="absolute left-0 right-0 bottom-0 rounded-t-2xl card p-4">
              <div className="mx-auto w-12 h-1.5 rounded-full bg-white/20 mb-3"></div>
              <button className="btn btn-ghost w-full" onClick={()=>{location.hash='admin'; setOpen(false)}}>Админка</button>
              <a href="#constructor" className="btn btn-ghost w-full" onClick={()=>setOpen(false)}>Конструктор</a>
              <a href="#catalog" className="btn btn-ghost w-full" onClick={()=>setOpen(false)}>Каталог</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
