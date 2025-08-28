import React from 'react'

export default function HeroSlogan() {
  return (
    <section className="relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            <span className="bg-gradient-title bg-clip-text text-transparent">Футболки, в которых слышно сердце</span>
          </h1>
          <p className="mt-5 text-fog text-lg max-w-prose">
            Плотный хлопок 190 г/м², чистый силуэт и характер. Создай свой принт или выбирай из коллекции.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <a href="#catalog" className="btn btn-cta">К коллекции</a>
            <a href="#constructor" className="btn btn-ghost">Собрать свою</a>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <div className="text-sm text-fog">Слоган • «Душа Руси»</div>
            <div className="mt-2 text-2xl font-display">Характер, стиль и свобода самовыражения.</div>
          </div>
        </div>
      </div>
    </section>
  )
}
