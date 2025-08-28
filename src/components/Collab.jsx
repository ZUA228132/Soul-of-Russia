import React from 'react'

export default function Collab() {
  return (
    <section className="mt-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="text-xs text-fog uppercase tracking-widest mb-2">Коллаборация</div>
          <h3 className="text-2xl font-bold">Экслюзив с твич-стримером <span className="text-twitch">SNAISIX</span></h3>
          <p className="mt-3 text-fog">Спец‑принты, анонсы на стримах и лимитированные дропы. Следи в прямом эфире.</p>
          <div className="mt-4 flex gap-3">
            <a className="btn btn-ghost" href="https://twitch.tv/SNAISIX" target="_blank" rel="noreferrer">Смотреть на Twitch</a>
            <a className="link" href="https://twitch.tv/SNAISIX" target="_blank" rel="noreferrer">@SNAISIX</a>
          </div>
        </div>
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex items-center justify-center">
          <svg width="120" height="120" viewBox="0 0 240 240" aria-hidden className="text-twitch">
            <rect width="200" height="160" x="20" y="40" rx="20" fill="#9146FF"/>
            <rect width="40" height="40" x="60" y="90" fill="#0d0f12"/>
            <rect width="40" height="40" x="126" y="90" fill="#0d0f12"/>
            <polygon points="160,200 120,200 90,228 90,200 20,200 20,40 220,40 220,180" fill="#9146FF"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
