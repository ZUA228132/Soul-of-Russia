import React from 'react'

export default function HeroSlogan() {
  return (
    <section className="section">
      <h1 className="font-display text-5xl leading-[1.03] sm:text-6xl font-extrabold">
        <span className="bg-gradient-title bg-clip-text text-transparent">Футболки, в которых слышно сердце</span>
      </h1>
      <p className="mt-4 text-lg text-muted max-w-prose">
        Плотный хлопок <b>190 г/м²</b>, чистый силуэт и характер. Создай свой принт или выбери из коллекции.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <a href="#catalog" className="btn btn-cta">К коллекции</a>
        <a href="#constructor" className="btn btn-ghost">Собрать свою</a>
        <span className="badge">✓ Мягкая посадка</span>
        <span className="badge">✓ Устойчивые краски</span>
      </div>

      <div className="mt-6 card p-4">
        <div className="text-xs text-muted mb-1">Слоган • «Душа Руси»</div>
        <div className="text-2xl font-display">Характер, стиль и свобода самовыражения.</div>
      </div>
    </section>
  )
}
