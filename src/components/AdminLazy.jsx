
  const [logged, setLogged] = useState(false)
  const [pwd, setPwd] = useState('')
  const [draft, setDraft] = useState({ title:'', price:2490, color:'', description:'', images:[], tags:'унисекс', badges:[], published:true })
  const onLogin = () => { if (pwd === '152212') setLogged(true); else alert('Неверный пароль. Подсказка: 152212') }
  const onImg = async (e) => { const files = Array.from(e.target.files || []); const readers = await Promise.all(files.map(f => new Promise(res=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.readAsDataURL(f) }))); setDraft(d => ({...d, images:[...d.images, ...readers]})) }
  const add = () => { if (!draft.title) return alert('Название?'); const p = { id: crypto.randomUUID(), title: draft.title, price: Number(draft.price||0), color: draft.color||'—', images: draft.images.length? draft.images : [svgImage(draft.title)], description: draft.description||'—', tags: draft.tags?.split(',').map(s=>s.trim()).filter(Boolean) ?? [], badges: draft.badges ?? [], published: !!draft.published }; setProducts(ps => [p, ...ps]); setDraft({ title:'', price:2490, color:'', description:'', images:[], tags:'унисекс', badges:[], published:true }); alert('Добавлено!') }
  const del = (id) => setProducts(ps => ps.filter(x => x.id !== id))
  const toggle = (id) => setProducts(ps => ps.map(x => x.id===id ? {...x, published:!x.published} : x))
  const toggleBadge = (b) => setDraft(d => ({...d, badges: d.badges?.includes(b) ? d.badges.filter(x=>x!==b) : [...(d.badges||[]), b]}))
  if (!logged) return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h2 className="font-display text-3xl font-extrabold mb-4">Админка</h2>
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <label className="text-sm text-fog">Пароль</label>
        <input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none"/>
        <button className="btn btn-ghost mt-3 w-full" onClick={onLogin}>Войти</button>
        <p className="mt-3 text-xs text-fog">Пароль: <b>152212</b></p>
      </div>
    </div>
  )
  const badgeDefs = [ { id:'hit', label:'Хит', ico:'🔥' }, { id:'star', label:'Новинка', ico:'⭐️' }, { id:'gift', label:'Подарок', ico:'🎁' }, { id:'bolt', label:'Эксклюзив', ico:'⚡️' } ]
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="font-display text-3xl font-extrabold mb-6">Новый товар</h2>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="space-y-3">
            <div><label className="text-sm text-fog">Название</label><input value={draft.title} onChange={e=>setDraft(d=>({...d, title:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm text-fog">Цена</label><input type="number" value={draft.price} onChange={e=>setDraft(d=>({...d, price:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none"/></div>
              <div><label className="text-sm text-fog">Цвет</label><input value={draft.color} onChange={e=>setDraft(d=>({...d, color:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none"/></div>
            </div>
            <div><label className="text-sm text-fog">Теги (через запятую)</label><input value={draft.tags} onChange={e=>setDraft(d=>({...d, tags:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none"/></div>
            <div><label className="text-sm text-fog">Описание</label><textarea rows="4" value={draft.description} onChange={e=>setDraft(d=>({...d, description:e.target.value}))} className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none"></textarea></div>
            <div><label className="text-sm text-fog">Изображения</label><input type="file" accept="image/*" multiple onChange={onImg} className="mt-1 w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2 outline-none"/>
              <div className="mt-2 grid grid-cols-3 gap-2">{draft.images?.map((src, idx)=>(<img key={idx} src={src} className="w-full h-20 object-cover rounded-lg"/>))}</div>
            </div>
            <div>
              <div className="text-sm text-fog mb-1">Бейджи</div>
              <div className="flex flex-wrap gap-2">{badgeDefs.map(b => (<button key={b.id} onClick={()=>toggleBadge(b.id)} className={`badge ${draft.badges?.includes(b.id)?'bg-white/10':''}`}>{b.ico} {b.label}</button>))}</div>
            </div>
            <div className="flex items-center gap-2"><input id="pub" type="checkbox" checked={draft.published} onChange={e=>setDraft(d=>({...d, published:e.target.checked}))}/><label htmlFor="pub" className="text-sm">Опубликовано</label></div>
            <button className="btn btn-ghost w-full" onClick={add}>Добавить</button>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="font-display text-xl font-extrabold mb-3">Товары</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {products.map(p => (
              <div key={p.id} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex gap-3">
                  <img src={p.images?.[0]} className="w-28 h-24 object-cover rounded-xl"/>
                  <div className="flex-1">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-fog text-sm">{money(p.price)}</div>
                    <div className="mt-2 flex gap-2">{(p.badges||[]).map(b => <span key={b} className="badge">{({'hit':'🔥','star':'⭐️','gift':'🎁','bolt':'⚡️'})[b]}</span>)}</div>
                    <div className="mt-1 flex gap-2">{p.tags?.map(t => <span key={t} className="badge">{t}</span>)}</div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="btn btn-ghost" onClick={()=>toggle(p.id)}>Скрыть/Показать</button>
                  <button className="btn btn-ghost" onClick={()=>del(p.id)}>Удалить</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

