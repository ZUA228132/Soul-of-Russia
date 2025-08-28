import React from 'react'

const Icon = ({children}) => (
  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">{children}</div>
)

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-ink/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold">ДР</div>
        <div className="leading-tight">
          <div className="font-semibold">Душа Руси</div>
          <div className="text-xs text-fog">ФУТБОЛКИ</div>
        </div>

        <div className="flex-1"></div>

        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl">
          <div className="flex items-center gap-2 flex-1 px-3 h-10 rounded-xl bg-white/5 border border-white/10">
            <span className="text-fog">🔎</span>
            <input placeholder="Поиск по коллекции" className="bg-transparent outline-none flex-1 text-sm placeholder:text-fog/70"/>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Icon>🌞</Icon>
          <Icon>⚙️</Icon>
          <Icon>🧺</Icon>
        </div>
      </div>
    </header>
  )
}
