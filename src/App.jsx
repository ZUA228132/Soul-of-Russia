import React, { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import HeroSlogan from './components/HeroSlogan.jsx'
import CollabHero from './components/CollabHero.jsx'
import Filters from './components/Filters.jsx'
import Constructor2D from './components/Constructor2D.jsx'
import PWAInstallHint from './components/PWAInstallHint.jsx'
import Divider from './components/Divider.jsx'

const money = (n) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n)
const LS_PRODUCTS = 'dusha_rusi_products'
const LS_CART = 'dusha_rusi_cart'
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }

const svgImage = (title = 'Душа Руси', color = '#0b0c10', accent = '#d4af37') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${accent}" stop-opacity="0.2"/><stop offset="100%" stop-color="white" stop-opacity="0"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="${color}"/><rect width="100%" height="100%" fill="url(#g)"/>
    <text x="60" y="160" font-family="Unbounded, Arial, sans-serif" font-size="72" fill="${accent}" opacity="0.9">Душа Руси</text>
    <text x="60" y="250" font-family="Inter, Arial, sans-serif" font-size="40" fill="white" opacity="0.88">${title}</text>
  </svg>`
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}

const seedProducts = () => [
  { id: crypto.randomUUID(), title: 'Футболка «Золотой Витязь»', price: 2990, images: [svgImage('Золотой Витязь','#0b0c10')], description: 'Глубокий чёрный, золотая эмблема.', tags: ['унисекс','лимит'], badges: ['star'] , published: true },
  { id: crypto.randomUUID(), title: 'Футболка «Северный Ветер»',   price: 2790, images: [svgImage('Северный Ветер','#0f172a')], description: 'Чистые линии, холодный стиль.', tags: ['унисекс','новинка'], badges: ['hit'], published: true },
  { id: crypto.randomUUID(), title: 'Футболка «SNAISIX drop»',     price: 3190, images: [svgImage('SNAISIX drop','#1b1029')], description: 'Коллаборация со SNAISIX.', tags: ['лимит'], badges: ['bolt','gift'], published: true }
]

const useProducts = () => { const [p, setP] = useState(() => load(LS_PRODUCTS, null) ?? (() => { const seeded = seedProducts(); save(LS_PRODUCTS, seeded); return seeded })()); useEffect(() => save(LS_PRODUCTS, p), [p]); return [p, setP] }
const useCart = () => {
  const [cart, setCart] = useState(() => load(LS_CART, []))
  useEffect(() => save(LS_CART, cart), [cart])
  const add = (pr) => setCart(c => { const i = c.findIndex(x=>x.id===pr.id); if (i>=0){ const copy=[...c]; copy[i].qty++; return copy } return [...c,{ id:pr.id, title:pr.title, price:pr.price, image:pr.images?.[0], qty:1 }] })
  const addCustomPng = (dataUrl) => setCart(c => [...c, { id: crypto.randomUUID(), title: 'Кастомная футболка', price: 3490, image: dataUrl, qty:1 }])
  const remove = (id) => setCart(c => c.filter(i => i.id !== id))
  const inc = (id) => setCart(c => c.map(i => i.id===id? {...i, qty:i.qty+1}: i))
  const dec = (id) => setCart(c => c.map(i => i.id===id? {...i, qty:Math.max(1,i.qty-1)}: i))
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const clear = () => setCart([])
  return { cart, add, addCustomPng, remove, inc, dec, total, clear }
}

const BadgeIco = ({b}) => { const map = { hit:'🔥', star:'⭐️', gift:'🎁', bolt:'⚡️' }; return <span title={b} className="badge">{map[b] || '•'}</span> }
const ProductCard = ({p, onAdd}) => (
  <div className="card overflow-hidden">
    <div className="aspect-[4/3] overflow-hidden"><img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover"/></div>
    <div className="p-4">
      <div className="flex items-center justify-between gap-3"><h3 className="font-semibold text-lg">{p.title}</h3><span className="text-gold font-semibold">{money(p.price)}</span></div>
      <p className="mt-2 text-sm text-muted line-clamp-2">{p.description}</p>
      <div className="mt-3 flex gap-2">{(p.badges||[]).map(b => <BadgeIco key={b} b={b}/>)}</div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">{p.tags?.map(t => <span key={t} className="badge">{t}</span>)}</div>
        <button onClick={()=>onAdd(p)} className="btn btn-cta px-4">В корзину</button>
      </div>
    </div>
  </div>
)
const Catalog = ({ products, onAdd, filters }) => {
  const filtered = useMemo(() => products.filter(p => {
    if (filters.query && !p.title.toLowerCase().includes(filters.query.toLowerCase())) return false
    if (filters.tags?.length){ const ok = filters.tags.some(t => p.tags?.includes(t)); if (!ok) return false }
    if (filters.badges?.length){ const ok = filters.badges.some(b => p.badges?.includes(b)); if (!ok) return false }
    if (p.price > (filters.price || 999999)) return false
    return p.published
  }), [products, filters])
  return (
    <section id="catalog" className="section">
      <div className="flex items-end justify-between mb-4"><h2 className="font-display text-3xl font-extrabold">Каталог</h2><span className="text-muted">{filtered.length} из {products.length}</span></div>
      <div className="grid sm:grid-cols-2 gap-4">{filtered.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd}/>)}</div>
      <div className="mt-6"><button onClick={()=>location.hash='#constructor'} className="btn btn-ghost">Собрать свою</button></div>
    </section>
  )
}
const Cart = ({ cart, inc, dec, remove, total, clear }) => (
  <div className="section">
    <h2 className="font-display text-3xl font-extrabold mb-4">Корзина</h2>
    {cart.length === 0 ? (<div className="text-muted">Пусто. Но это легко исправить 😉</div>) : (
      <div className="space-y-4">
        {cart.map(i => (
          <div key={i.id} className="flex items-center gap-3 card p-3">
            <img src={i.image || 'icons/icon-192.png'} alt={i.title} className="w-20 h-16 object-cover rounded-xl"/>
            <div className="flex-1"><div className="font-semibold">{i.title}</div><div className="text-muted">{money(i.price)}</div></div>
            <div className="flex items-center gap-2"><button onClick={()=>dec(i.id)} className="w-8 h-8 rounded-lg btn-ghost">-</button><div className="w-8 text-center">{i.qty}</div><button onClick={()=>inc(i.id)} className="w-8 h-8 rounded-lg btn-ghost">+</button></div>
            <button onClick={()=>remove(i.id)} className="ml-2 text-muted hover:opacity-80">Удалить</button>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2" style={{borderTop:'1px solid var(--border)'}}><div className="text-muted">Итого</div><div className="font-display text-2xl text-gold">{money(total)}</div></div>
        <div className="flex gap-3"><button className="btn btn-ghost" onClick={clear}>Очистить</button><button className="btn btn-cta" onClick={()=>{ alert('Заказ создан! (демо)'); clear(); location.hash=''; }}>Оформить</button></div>
      </div>
    )}
  </div>
)
const Admin = React.lazy(() => import('./components/AdminLazy.jsx'))

export default function App() {
  const [products, setProducts] = useProducts()
  const cart = useCart()
  const [route, setRoute] = useState(() => location.hash.replace('#',''))
  const [filters, setFilters] = useState({ query:'', tags:[], badges:[], price:6000 })
  useEffect(() => { const onHash = () => setRoute(location.hash.replace('#','')); window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [])

  return (
    <div className="min-h-screen app-bg text-base-text">
      <Navbar cartCount={cart.cart.length}/>
      <PWAInstallHint/>

      {route === 'admin' ? (
        <React.Suspense fallback={<div className="section">Загрузка…</div>}>
          <Admin products={products} setProducts={setProducts}/>
        </React.Suspense>
      ) : route === 'cart' ? <Cart {...cart}/> :
        route === 'constructor' ? (
          <div className="section">
            <h2 className="font-display text-3xl font-extrabold mb-4">Конструктор</h2>
            <Constructor2D onAddToCart={(png)=>{ cart.addCustomPng(png); location.hash='#cart' }}/>
          </div>
        ) : (
        <>
          <HeroSlogan/>
          <Divider/>
          <CollabHero/>
          <Filters onChange={setFilters}/>
          <Catalog products={products} onAdd={cart.add} filters={filters}/>
        </>
      )}

      <footer className="section text-center text-muted">
        © 2025 «Душа Руси»
      </footer>
    </div>
  )
}

// Hooks and Admin lazy file
function useProducts(){ const [p, setP] = React.useState(()=>JSON.parse(localStorage.getItem('dusha_rusi_products')||'null') ?? (()=>{ const s = seedProducts(); localStorage.setItem('dusha_rusi_products', JSON.stringify(s)); return s })()); React.useEffect(()=>localStorage.setItem('dusha_rusi_products', JSON.stringify(p)), [p]); return [p,setP] }
function useCart(){ const [cart,setCart]=React.useState(()=>JSON.parse(localStorage.getItem('dusha_rusi_cart')||'[]')); React.useEffect(()=>localStorage.setItem('dusha_rusi_cart', JSON.stringify(cart)),[cart]); const add=(pr)=>setCart(c=>{const i=c.findIndex(x=>x.id===pr.id); if(i>=0){const cp=[...c]; cp[i].qty++; return cp} return [...c,{id:pr.id,title:pr.title,price:pr.price,image:pr.images?.[0],qty:1}]}); const addCustomPng=(dataUrl)=>setCart(c=>[...c,{id:crypto.randomUUID(),title:'Кастомная футболка',price:3490,image:dataUrl,qty:1}]); const remove=(id)=>setCart(c=>c.filter(i=>i.id!==id)); const inc=(id)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:i.qty+1}:i)); const dec=(id)=>setCart(c=>c.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty-1)}:i)); const total=cart.reduce((s,i)=>s+i.price*i.qty,0); const clear=()=>setCart([]); return {cart,add,addCustomPng,remove,inc,dec,total,clear} }
