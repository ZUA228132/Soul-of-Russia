import React from 'react'

export default function CollabHero() {
  return (
    <section className="relative border-b border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1b1029] via-ink to-[#2b183d] opacity-60"></div>
      <div className="absolute inset-0" style={{backgroundImage:'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.2), transparent 40%), radial-gradient(circle at 80% 30%, rgba(145,70,255,0.18), transparent 40%)'}}></div>
      <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            <span className="bg-gradient-title bg-clip-text text-transparent">Душа Руси × SNAISIX</span>
          </h1>
          <p className="mt-5 text-fog text-lg max-w-prose">
            Эксклюзивная коллаборация со стримером <b>SNAISIX</b>: лимитированные принты, дропы в прямом эфире и награды для подписчиков.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <a href="https://twitch.tv/SNAISIX" target="_blank" rel="noreferrer" className="btn btn-cta">Смотреть на Twitch</a>
            <span className="badge">✓ Премиум хлопок 190 г/м²</span>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="flex items-center gap-3">
              <svg width="36" height="36" viewBox="0 0 240 240" aria-hidden>
                <rect width="200" height="160" x="20" y="40" rx="20" fill="#9146FF"/>
                <rect width="40" height="40" x="60" y="90" fill="#0d0f12"/>
                <rect width="40" height="40" x="126" y="90" fill="#0d0f12"/>
                <polygon points="160,200 120,200 90,228 90,200 20,200 20,40 220,40 220,180" fill="#9146FF"/>
              </svg>
              <div>
                <div className="font-semibold text-lg">SNAISIX</div>
                <div className="text-fog text-sm">@SNAISIX</div>
              </div>
            </div>
            <ul className="mt-4 text-sm space-y-2 text-fog">
              <li>• Лимитированные дропы и ранний доступ</li>
              <li>• Спец-принты «только на стримах»</li>
              <li>• Скидки для подписчиков</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
