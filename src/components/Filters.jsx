import React, { useState, useEffect } from 'react'
export default function Filters({ onChange, initial }) {
  const [query, setQuery] = useState(initial?.query || '')
  const [tags, setTags] = useState(new Set(initial?.tags || []))
  const [badges, setBadges] = useState(new Set(initial?.badges || []))
  const [price, setPrice] = useState(initial?.price || 6000)
  useEffect(() => { onChange({ query, tags: [...tags], badges: [...badges], price }) }, [query, tags, badges, price])
  const toggle = (set, v) => set(prev => { const n = new Set(prev); n.has(v) ? n.delete(v) : n.add(v); return n })
  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap gap-3 items-center">
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск..." className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/>
      <div className="flex items-center gap-2">{['новинка','унисекс','лимит'].map(t => (<button key={t} onClick={()=>toggle(setTags, t)} className={`badge ${tags.has(t)?'bg-gold/20 border-gold/40':''}`}>{t}</button>))}</div>
      <div className="flex items-center gap-2">{[['hit','🔥'],['star','⭐️'],['gift','🎁'],['bolt','⚡️']].map(([b,ico]) => (<button key={b} onClick={()=>toggle(setBadges, b)} className={`badge ${badges.has(b)?'bg-white/10':''}`}>{ico}</button>))}</div>
      <div className="flex items-center gap-2 text-sm"><span className="text-fog">До</span><input type="range" min="500" max="6000" value={price} onChange={e=>setPrice(Number(e.target.value))}/><span className="text-gold font-semibold">{new Intl.NumberFormat('ru-RU').format(price)} ₽</span></div>
    </div>
  )
}
