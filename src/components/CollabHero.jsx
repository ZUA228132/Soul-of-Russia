import React from 'react'
export default function CollabHero() {
  return (
    <section className="section">
      <div className="card p-5 collab-card">
        <div className="flex items-center gap-3">
          <img src="https://spng.pngfind.com/pngs/s/180-1800308_twitch-logo-png-transparent-background-twitch-logo-no.png" alt="Twitch" className="w-7 h-7 object-contain"/>
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
          <a href="#constructor" className="btn btn-ghost whitespace-nowrap">Собрать коллаб</a>
        </div>
      </div>
    </section>
  )
}
