import React from 'react'
export default function CollabHero() {
  return (
    <div className="divider"></div>
    <section className="section">
      <div className="card p-5 collab-card">
        <div className="flex items-center gap-3">
          <svg width="28" height="28" viewBox="0 0 240 240" aria-hidden>
            <rect width="200" height="160" x="20" y="40" rx="20" fill="#9146FF"/>
            <rect width="40" height="40" x="60" y="90" fill="black"/>
            <rect width="40" height="40" x="126" y="90" fill="black"/>
            <polygon points="160,200 120,200 90,228 90,200 20,200 20,40 220,40 220,180" fill="#9146FF"/>
          </svg>
          <div>
            <div className="font-semibold text-lg">Душа Руси × SNAISIX</div>
            <div className="text-muted text-sm">@SNAISIX</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted">
          Лимитированные принты и дропы в эфире. Бонусы подписчикам.
        </p>
        <div className="mt-4 flex gap-3">
          <a href="https://twitch.tv/SNAISIX" target="_blank" rel="noreferrer" className="btn btn-cta whitespace-nowrap">Смотреть на Twitch</a>
        </div>
      </div>
    </section>
  )
}
