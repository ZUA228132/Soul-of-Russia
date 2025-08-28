import React from 'react'

const SizeChip = ({children}) => (
  <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">{children}</div>
)

const Tile = ({children}) => (
  <div className="card p-6">
    {children}
  </div>
)

const Shirt = ({variant='red'}) => {
  const common = "w-full h-full"
  const base = (p) => `
  <svg xmlns='http://www.w3.org/2000/svg' width='380' height='300' viewBox='0 0 380 300'>
    <defs>
      <clipPath id='tee'><path d='M75 40 L120 10 L160 40 H220 L260 10 L305 40 L320 80 V220 C320 245 300 260 280 260 H100 C80 260 60 245 60 220 V80 Z' /></clipPath>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='white' stop-opacity='0.1'/><stop offset='100%' stop-color='black' stop-opacity='0.2'/>
      </linearGradient>
      <pattern id='pat' width='24' height='24' patternUnits='userSpaceOnUse'>
        ${p}
      </pattern>
    </defs>
    <rect x='55' y='20' width='270' height='250' rx='28' ry='28' fill='url(#g)' opacity='0.35'/>
    <g clip-path='url(#tee)'>
      <rect width='380' height='300' fill='${variant==="white"?"#e9eaec":variant==="dark"?"#1f2227":"#2b0c0f"}'/>
      ${variant!=="plain" ? "<rect width=\'380\' height=\'300\' fill=\'url(#pat)\' opacity=\'0.9\'/>": ""}
    </g>
    <path d='M75 40 L120 10 L160 40 H220 L260 10 L305 40 L320 80 V220 C320 245 300 260 280 260 H100 C80 260 60 245 60 220 V80 Z' fill='none' stroke='black' opacity='0.25'/>
  </svg>`
  const patternRed = "<circle cx=\'12\' cy=\'12\' r=\'3\' fill=\'#c1122f\'/><path d=\'M0 12 H24 M12 0 V24\' stroke=\'#6e0a1b\' stroke-width=\'1\' opacity=\'0.6\'/>"
  const patternWaves = "<path d=\'M0 8 Q6 2 12 8 T24 8 V24 H0Z\' fill=\'#cfd3d8\'/><path d=\'M0 16 Q6 10 12 16 T24 16\' stroke=\'#a0a5aa\' stroke-width=\'1\' fill=\'none\'/>"
  const patternNone = ""
  const p = variant==='red'? patternRed : variant==='white'? patternNone : variant==='waves'? patternWaves : patternNone
  return <img alt="" className={common} src={`data:image/svg+xml;utf8,${encodeURIComponent(base(p))}`}/>
}

export default function Hero() {
  return (
    <section className="py-8 md:py-14">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="pt-4">
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            <span className="bg-gradient-title bg-clip-text text-transparent">
              Футболки, в которых слышно сердце
            </span>
          </h1>
          <p className="mt-5 text-fog text-lg max-w-prose">
            Минимализм, глубина и принты с характером. Сделаны для города и для легенд.
          </p>
          <div className="mt-7 flex items-center gap-3">
            <button className="btn btn-cta rounded-2xl px-5 py-3">К коллекции</button>
            <div className="badge">✓ Премиум хлопок 240 г/м²</div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {['XS','S','M','L','XL','XXL'].map(s => <SizeChip key={s}>{s}</SizeChip>)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <Tile><div className="aspect-square"><Shirt variant="red"/></div></Tile>
          <Tile><div className="aspect-square"><Shirt variant="white"/></div></Tile>
          <Tile><div className="aspect-square"><Shirt variant="waves"/></div></Tile>
          <Tile><div className="aspect-square"><Shirt variant="dark"/></div></Tile>
        </div>
      </div>
    </section>
  )
}
