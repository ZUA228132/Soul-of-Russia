import React, { useEffect, useState } from 'react'
import Hero3D from './components/Hero3D.jsx'

const money = (n) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(n)
const LS_PRODUCTS = 'dusha_rusi_products'
const LS_CART = 'dusha_rusi_cart'

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch { return d } }

const svgImage = (title = 'Душа Руси', color = '#0b0c10', accent = '#d4af37') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${accent}" stop-opacity="0.2"/><stop offset="100%" stop-color="white" stop-opacity="0"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="${color}"/><rect width="100%" height="100%" fill="url(#g)"/>
    <g fill="none" stroke="${accent}" stroke-width="6" opacity="0.35"><circle cx="980" cy="120" r="80"/><circle cx="1040" cy="180" r="40"/><path d="M0 820 C 200 760, 380 880, 640 820 S 1100 760, 1200 880"/></g>
    <text x="60" y="160" font-family="Unbounded, Arial, sans-serif" font-size="72" fill="${accent}" opacity="0.9">Душа Руси</text>
    <text x="60" y="250" font-family="Inter, Arial, sans-serif" font-size="40" fill="white" opacity="0.88">${title}</text>
  </svg>`
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
}

const seedProducts = () => [
  { id: crypto.randomUUID(), title: 'Футболка «Золотой Витязь»', price: 2990, color: 'Чёрная', images: [svgImage('Золотой Витязь','#0b0c10')], description: 'Плотный хлопок 240 г/м², золотая тиснёная эмблема. Для тех, кто держит строй.', tags: ['унисекс','лимитированная'], published: true },
  { id: crypto.randomUUID(), title: 'Футболка «Северный Ветер»',   price: 2790, color: 'Белая',  images: [svgImage('Северный Ветер','#0f172a')], description: 'Чистые линии, холодный стиль. Дышащая ткань и идеальная посадка.', tags: ['унисекс'], published: true },
  { id: crypto.randomUUID(), title: 'Футболка «Пламя Степей»',     price: 2890, color: 'Бордовая', images: [svgImage('Пламя Степей','#220c10')], description: 'Насыщенный цвет и акцент на деталях. Для ярких характеров.', tags: ['унисекс','новинка'], published: true }
]

const useProducts = () => {
  const [products, setProducts] = useState(() => load(LS_PRODUCTS, null) ?? (() => { const seeded = seedProducts(); save(LS_PRODUCTS, seeded); return seeded })())
  useEffect(() => save(LS_PRODUCTS, products), [products])
  return [products, setProducts]
}

const useCart = () => {
  const [cart, setCart] = useState(() => load(LS_CART, []))
  useEffect(() => save(LS_CART, cart), [cart])
  const add = (p) => setCart(c => { const i = c.findIndex(x=>x.id===p.id); if (i>=0){ const copy=[...c]; copy[i].qty++; return copy } return [...c,{ id:p.id, title:p.title, price:p.price, image:p.images?.[0], qty:1 }] })
  const remove = (id) => setCart(c => c.filter(i => i.id !== id))
  const inc = (id) => setCart(c => c.map(i => i.id===id? {...i, qty:i.qty+1}: i))
  const dec = (id) => setCart(c => c.map(i => i.id===id? {...i, qty:Math.max(1,i.qty-1)}: i))
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0)
  const clear = () => setCart([])
  return { cart, add, remove, inc, dec, total, clear }
}

const Badge = ({children}) => <span className="inline-flex items-center text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-fog">{children}</span>
const Button = ({children, onClick, variant='primary', className=''}) => {
  const base = "relative isolate overflow-hidden group inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition"
  const variants = { primary: "bg-gold/90 hover:bg-gold text-ink shadow-glow", ghost: "bg-white/5 hover:bg-white/10 border border-white/10 text-white", subtle: "bg-white/3 hover:bg-white/5 text-white" }
  return <button onClick={onClick} className={`${base} ${variants[variant]} ${className}`}>{children}</button>
}

const IconCart = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" className={`${props.className||''} stroke-current`} strokeWidth="1.6">
    <path d="M3 3h2l1.6 10.6a2 2 0 0 0 2 1.7h7.8a2 2 0 0 0 2-1.5l1.4-6.3H6.1" />
    <circle cx="9" cy="20" r="1.6" />
    <circle cx="18" cy="20" r="1.6" />
  </svg>
)
const IconAdmin = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" className={`${props.className||''} stroke-current`} strokeWidth="1.6">
    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-5 0-8 2.5-8 5v1h16v-1c0-2.5-3-5-8-5Z"/>
  </svg>
)

const Nav = ({ onGoAdmin, onGoHome, cartCount }) => (
  <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-ink/60 bg-ink/90 border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/icons/icon-192.png" className="w-8 h-8 rounded-full" alt="logo"/>
        <a onClick={onGoHome} className="cursor-pointer font-display text-xl font-extrabold tracking-wide">
          <span className="text-white">Душа </span><span className="text-gold">Руси</span>
        </a>
        <Badge>Футболки</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={onGoAdmin} className="gap-2">
          <IconAdmin className="w-5 h-5"/><span>Админка</span>
        </Button>
        <Button variant="primary" onClick={()=>location.hash='#cart'} className="gap-2">
          <IconCart className="w-5 h-5"/><span>Корзина{cartCount?` • ${cartCount}`:''}</span>
        </Button>
      </div>
    </div>
  </nav>
)

const ProductCard = ({p, onAdd}) => (
  <div className="group rounded-3xl bg-white/3 border border-white/10 overflow-hidden hover:shadow-glow transition">
    <div className="aspect-[4/3] overflow-hidden">
      <img src={p.images?.[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition"/>
    </div>
    <div className="p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-semibold text-lg md:text-xl">{p.title}</h3>
        <span className="text-gold font-semibold">{money(p.price)}</span>
      </div>
      <p className="mt-2 text-sm text-fog line-clamp-2">{p.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2">
          {p.tags?.map(t => <Badge key={t}>{t}</Badge>)}
        </div>
        <Button onClick={()=>onAdd(p)} className="px-4">В корзину</Button>
      </div>
    </div>
  </div>
)

const Catalog = ({ products, onAdd }) => (
  <section id="catalog" className="max-w-7xl mx-auto px-4 pb-16">
    <div className="flex items-end justify-between mb-4">
      <h2 className="font-display text-2xl md:text-3xl font-extrabold">Каталог</h2>
      <span className="text-fog">{products.length} позиций</span>
    </div>
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.filter(p=>p.published).map(p => (
        <ProductCard key={p.id} p={p} onAdd={onAdd}/>
      ))}
    </div>
  </section>
)

const Cart = ({ cart, inc, dec, remove, total, clear }) => (
  <div className="max-w-4xl mx-auto px-4 py-10">
    <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-6">Корзина</h2>
    {cart.length === 0 ? (
      <div className="text-fog">Пусто. Но это легко исправить 😉</div>
    ) : (
      <div className="space-y-4">
        {cart.map(i => (
          <div key={i.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/3 border border-white/10">
            <img src={i.image} alt={i.title} className="w-20 h-16 object-cover rounded-xl"/>
            <div className="flex-1">
              <div className="font-semibold">{i.title}</div>
              <div className="text-fog">{money(i.price)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>dec(i.id)} className="w-8 h-8 rounded-lg bg-white/10">-</button>
              <div className="w-8 text-center">{i.qty}</div>
              <button onClick={()=>inc(i.id)} className="w-8 h-8 rounded-lg bg-white/10">+</button>
            </div>
            <button onClick={()=>remove(i.id)} className="ml-2 text-fog hover:text-white">Удалить</button>
          </div>
        ))}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-fog">Итого</div>
          <div className="font-display text-2xl text-gold">{money(total)}</div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={clear}>Очистить</Button>
          <Button onClick={()=>{ alert('Заказ создан! (демо)'); clear(); location.hash=''; }}>Оформить</Button>
        </div>
      </div>
    )}
  </div>
)

const Admin = ({ products, setProducts }) => {
  const [logged, setLogged] = useState(false)
  const [pwd, setPwd] = useState('')
  const [draft, setDraft] = useState({ title:'', price:2490, color:'', description:'', images:[], tags:'унисекс', published:true })
  const onLogin = () => { if (pwd === 'admin') setLogged(true); else alert('Неверный пароль. Подсказка: admin') }
  const onImg = async (e) => {
    const files = Array.from(e.target.files || [])
    const readers = await Promise.all(files.map(f => new Promise(res=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(f) })))
    setDraft(d => ({...d, images:[...d.images, ...readers]}))
  }
  const add = () => {
    if (!draft.title) return alert('Название?')
    const p = { id: crypto.randomUUID(), title: draft.title, price: Number(draft.price||0), color: draft.color||'—', images: draft.images.length? draft.images : [svgImage(draft.title)], description: draft.description||'—', tags: draft.tags?.split(',').map(s=>s.trim()).filter(Boolean) ?? [], published: !!draft.published }
    setProducts(ps => [p, ...ps]); setDraft({ title:'', price:2490, color:'', description:'', images:[], tags:'унисекс', published:true }); alert('Добавлено!')
  }
  const del = (id) => setProducts(ps => ps.filter(x => x.id !== id))
  const toggle = (id) => setProducts(ps => ps.map(x => x.id===id ? {...x, published:!x.published} : x))

  if (!logged) return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h2 className="font-display text-3xl font-extrabold mb-4">Админка</h2>
      <div className="p-4 rounded-2xl bg-white/3 border border-white/10">
        <label className="text-sm text-fog">Пароль</label>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"/>
        <Button className="mt-4 w-full" onClick={onLogin}>Войти</Button>
        <p className="mt-3 text-xs text-fog">Демо: пароль <b>admin</b></p>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="font-display text-3xl font-extrabold mb-6">Новый товар</h2>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 p-4 rounded-2xl bg-white/3 border border-white/10">
          <div className="space-y-3">
            <div><label className="text-sm text-fog">Название</label><input value={draft.title} onChange={e=>setDraft(d=>({...d, title:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm text-fog">Цена</label><input type="number" value={draft.price} onChange={e=>setDraft(d=>({...d, price:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"/></div>
              <div><label className="text-sm text-fog">Цвет</label><input value={draft.color} onChange={e=>setDraft(d=>({...d, color:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"/></div>
            </div>
            <div><label className="text-sm text-fog">Теги (через запятую)</label><input value={draft.tags} onChange={e=>setDraft(d=>({...d, tags:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"/></div>
            <div><label className="text-sm text-fog">Описание</label><textarea rows="4" value={draft.description} onChange={e=>setDraft(d=>({...d, description:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"></textarea></div>
            <div><label className="text-sm text-fog">Изображения</label><input type="file" accept="image/*" multiple onChange={onImg} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 outline-none"/>
              <div className="mt-2 grid grid-cols-3 gap-2">{draft.images.map((src, idx)=>(<img key={idx} src={src} className="w-full h-20 object-cover rounded-lg"/>))}</div>
            </div>
            <div className="flex items-center gap-2"><input id="pub" type="checkbox" checked={draft.published} onChange={e=>setDraft(d=>({...d, published:e.target.checked}))}/><label htmlFor="pub" className="text-sm">Опубликовано</label></div>
            <Button onClick={add} className="w-full">Добавить</Button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="font-display text-xl font-extrabold mb-3">Товары</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-white/3 border border-white/10">
                <div className="flex gap-3">
                  <img src={p.images?.[0]} className="w-28 h-24 object-cover rounded-xl"/>
                  <div className="flex-1">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-fog text-sm">{money(p.price)}</div>
                    <div className="mt-2 flex gap-2"><Badge>{p.published? 'опубликовано':'скрыто'}</Badge>{p.tags?.map(t=> <Badge key={t}>{t}</Badge>)}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2"><Button variant="ghost" onClick={()=>setProducts(ps=>ps.map(x=>x.id===p.id? {...x, published:!x.published} : x))}>Скрыть/Показать</Button><Button variant="ghost" onClick={()=>setProducts(ps=>ps.filter(x=>x.id!==p.id))}>Удалить</Button></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const Footer = () => (
  <footer className="border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-fog">© 2025 «Душа Руси». Интерактив и стиль.</div>
      <div className="flex gap-3">
        <a className="text-fog hover:text-white" href="#" onClick={(e)=>{e.preventDefault(); alert('Пользовательское соглашение — демо.')}}>Условия</a>
        <span className="opacity-20">•</span>
        <a className="text-fog hover:text-white" href="#" onClick={(e)=>{e.preventDefault(); alert('Политика конфиденциальности — демо.')}}>Конфиденциальность</a>
      </div>
    </div>
  </footer>
)

export default function App() {
  const [products, setProducts] = useProducts()
  const cart = useCart()
  const [route, setRoute] = useState(() => location.hash.replace('#',''))
  useEffect(() => { const onHash = () => setRoute(location.hash.replace('#','')); window.addEventListener('hashchange', onHash); return () => window.removeEventListener('hashchange', onHash) }, [])

  return (
    <div className="pb-10">
      <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-ink/60 bg-ink/90 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icons/icon-192.png" className="w-8 h-8 rounded-full" alt="logo"/>
            <a onClick={()=>{location.hash='';}} className="cursor-pointer font-display text-xl font-extrabold tracking-wide">
              <span className="text-white">Душа </span><span className="text-gold">Руси</span>
            </a>
            <span className="inline-flex items-center text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-fog">Футболки</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative isolate overflow-hidden group inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition bg-white/5 hover:bg-white/10 border border-white/10 text-white" onClick={()=>location.hash='admin'}>Админка</button>
            <button className="relative isolate overflow-hidden group inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition bg-gold/90 hover:bg-gold text-ink shadow-glow" onClick={()=>location.hash='#cart'}>Корзина{cart.cart.length?` • ${cart.cart.length}`:''}</button>
          </div>
        </div>
      </nav>

      {route === 'admin' ? <Admin products={products} setProducts={setProducts}/> :
       route === 'cart' ? (
        <div className="max-w-4xl mx-auto px-4 py-10">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-6">Корзина</h2>
          {cart.cart.length === 0 ? (
            <div className="text-fog">Пусто. Но это легко исправить 😉</div>
          ) : (
            <div className="space-y-4">
              {cart.cart.map(i => (
                <div key={i.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/3 border border-white/10">
                  <img src={i.image} alt={i.title} className="w-20 h-16 object-cover rounded-xl"/>
                  <div className="flex-1">
                    <div className="font-semibold">{i.title}</div>
                    <div className="text-fog">{money(i.price)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>cart.dec(i.id)} className="w-8 h-8 rounded-lg bg-white/10">-</button>
                    <div className="w-8 text-center">{i.qty}</div>
                    <button onClick={()=>cart.inc(i.id)} className="w-8 h-8 rounded-lg bg-white/10">+</button>
                  </div>
                  <button onClick={()=>cart.remove(i.id)} className="ml-2 text-fog hover:text-white">Удалить</button>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="text-fog">Итого</div>
                <div className="font-display text-2xl text-gold">{money(cart.total)}</div>
              </div>
              <div className="flex gap-3">
                <button className="relative isolate overflow-hidden group inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition bg-white/5 hover:bg-white/10 border border-white/10 text-white" onClick={cart.clear}>Очистить</button>
                <button className="relative isolate overflow-hidden group inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition bg-gold/90 hover:bg-gold text-ink shadow-glow" onClick={()=>{ alert('Заказ создан! (демо)'); cart.clear(); location.hash=''; }}>Оформить</button>
              </div>
            </div>
          )}
        </div>
       ) : (
        <>
          <section className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 pt-14 pb-16 md:pt-18 md:pb-20">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                    <span className="text-fog">Новая коллекция уже здесь</span>
                  </div>
                  <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-tight">
                    Красота. Характер. <span className="text-gold">Интерактив</span> в каждом кадре.
                  </h1>
                  <p className="mt-4 text-lg text-fog max-w-prose">
                    WebGL + GSAP: реакция на курсор, скролл-анимации и плавный контроль камеры.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <button onClick={()=>document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'})} className="relative isolate overflow-hidden group inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition bg-gold/90 hover:bg-gold text-ink shadow-glow">Смотреть каталог</button>
                    <button onClick={()=>alert('О бренде: классика и современность в золотом сплаве.')} className="relative isolate overflow-hidden group inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition bg-white/5 hover:bg-white/10 border border-white/10 text-white">О бренде</button>
                  </div>
                </div>
                <Hero3D/>
              </div>
            </div>
          </section>
          <Catalog products={products} onAdd={cart.add}/>
        </>
       )}
      <Footer/>
    </div>
  )
}
