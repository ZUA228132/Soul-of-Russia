import React, { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Rect, Group, Image as KImage, Text as KText, Line } from 'react-konva'

const PRINT_W = 800, PRINT_H = 1000
const SAFE_INSET = 60

function useImage(src) {
  const [image, setImage] = useState(null)
  useEffect(() => {
    if (!src) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setImage(img)
    img.src = src
  }, [src])
  return image
}

function Toolbar({ onAddText, onUpload, onFlip, onDelete, onDuplicate, onBringF, onSendB, onAlign, selected, setProp, side, setSide, exportPNG, grid, setGrid }) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10">
      <button className="btn btn-ghost" onClick={onUpload}>Загрузить изображение</button>
      <button className="btn btn-ghost" onClick={onAddText}>Добавить текст</button>
      <div className="badge">Сторона:</div>
      <div className="flex gap-1">
        <button className={`btn btn-ghost ${side==='front'?'border-gold/60':''}`} onClick={()=>setSide('front')}>Фронт</button>
        <button className={`btn btn-ghost ${side==='back'?'border-gold/60':''}`} onClick={()=>setSide('back')}>Спина</button>
      </div>
      <div className="flex-1"></div>
      <label className="flex items-center gap-2 text-sm text-fog">
        <input type="checkbox" checked={grid} onChange={e=>setGrid(e.target.checked)}/> Сетка/направляющие
      </label>
      <button className="btn btn-ghost" onClick={()=>onAlign('centerX')}>По центру X</button>
      <button className="btn btn-ghost" onClick={()=>onAlign('centerY')}>По центру Y</button>
      <button className="btn btn-ghost" onClick={onFlip}>Отразить</button>
      <button className="btn btn-ghost" onClick={onDuplicate}>Дублировать</button>
      <button className="btn btn-ghost" onClick={onBringF}>Вверх</button>
      <button className="btn btn-ghost" onClick={onSendB}>Вниз</button>
      <button className="btn btn-cta" onClick={exportPNG}>В корзину (PNG)</button>
      <button className="btn btn-ghost" onClick={onDelete}>Удалить</button>
    </div>
  )
}

export default function Constructor2D({ onAddToCart }) {
  const [side, setSide] = useState('front')
  const [front, setFront] = useState([])
  const [back, setBack] = useState([])
  const [selected, setSelected] = useState(null)
  const [shirtColor, setShirtColor] = useState('#e6e6e6')
  const [grid, setGrid] = useState(true)

  const active = side==='front'? front : back
  const setActive = side==='front'? setFront : setBack

  const stageRef = useRef(null)
  const fileRef = useRef(null)

  const addText = () => {
    const id = crypto.randomUUID()
    setActive(a => [...a, { id, type:'text', text:'Душа Руси', x: PRINT_W/2-120, y: PRINT_H/2-20, fontSize: 48, rotation:0, scaleX:1, scaleY:1, fill:'#0b0c10', stroke:'#000000', strokeWidth:0, flipX:false, opacity:1 }])
    setSelected(id)
  }
  const addImage = (src) => {
    const id = crypto.randomUUID()
    setActive(a => [...a, { id, type:'image', src, x: PRINT_W/2-150, y: PRINT_H/2-150, width:300, height:300, rotation:0, scaleX:1, scaleY:1, flipX:false, opacity:1 }])
    setSelected(id)
  }
  const onUpload = () => fileRef.current?.click()
  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    const url = URL.createObjectURL(f)
    addImage(url)
    e.target.value = ''
  }

  const onDelete = () => setActive(a => a.filter(el => el.id !== selected))
  const onDuplicate = () => setActive(a => {
    const el = a.find(e=>e.id===selected); if (!el) return a
    const copy = { ...el, id: crypto.randomUUID(), x: el.x + 20, y: el.y + 20 }
    return [...a, copy]
  })
  const onBringF = () => setActive(a => { const i = a.findIndex(e=>e.id===selected); if (i<0) return a; const copy=[...a]; const [el]=copy.splice(i,1); copy.push(el); return copy })
  const onSendB = () => setActive(a => { const i = a.findIndex(e=>e.id===selected); if (i<0) return a; const copy=[...a]; const [el]=copy.splice(i,1); copy.unshift(el); return copy })
  const onFlip = () => setActive(a => a.map(el => el.id===selected ? {...el, flipX: !el.flipX} : el))

  const onAlign = (mode) => setActive(a => a.map(el => el.id===selected ? {...el, x: mode==='centerX' ? (PRINT_W - (el.width||0)*el.scaleX)/2 : el.x, y: mode==='centerY' ? (PRINT_H - (el.height||0)*el.scaleY)/2 : el.y} : el))

  const exportPNG = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
    onAddToCart?.(uri)
  }

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (!selected) return
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
        e.preventDefault()
        const dx = e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:0
        const dy = e.key==='ArrowUp'?-1:e.key==='ArrowDown'?1:0
        setActive(a => a.map(el => el.id===selected ? {...el, x: el.x + dx*5, y: el.y + dy*5} : el))
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        setActive(a => a.filter(el => el.id !== selected))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, side])

  const updateProp = (patch) => setActive(a => a.map(el => el.id===selected ? {...el, ...patch} : el))

  const SelectedPanel = () => {
    const el = active.find(e=>e.id===selected)
    if (!el) return null
    return (
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="text-sm text-fog">Слой: <b>{el.type}</b></div>
        {'text'===el.type && (
          <>
            <div className="text-sm text-fog">Текст</div>
            <input value={el.text} onChange={e=>updateProp({text:e.target.value})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/>
            <div className="grid grid-cols-2 gap-2">
              <div><div className="text-sm text-fog">Размер</div><input type="number" value={el.fontSize} onChange={e=>updateProp({fontSize:Number(e.target.value)})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/></div>
              <div><div className="text-sm text-fog">Цвет</div><input type="color" value={el.fill} onChange={e=>updateProp({fill:e.target.value})} className="w-full h-10 rounded"/></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><div className="text-sm text-fog">Контур</div><input type="color" value={el.stroke} onChange={e=>updateProp({stroke:e.target.value})} className="w-full h-10 rounded"/></div>
              <div><div className="text-sm text-fog">Толщина</div><input type="number" value={el.strokeWidth} onChange={e=>updateProp({strokeWidth:Number(e.target.value)})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/></div>
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div><div className="text-sm text-fog">Прозрачность</div><input type="range" min="0" max="1" step="0.01" value={el.opacity} onChange={e=>updateProp({opacity:Number(e.target.value)})}/></div>
          <div><div className="text-sm text-fog">Поворот</div><input type="range" min="-180" max="180" value={el.rotation} onChange={e=>updateProp({rotation:Number(e.target.value)})}/></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div><div className="text-sm text-fog">Ширина</div><input type="number" value={el.width||100} onChange={e=>updateProp({width:Number(e.target.value)})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/></div>
          <div><div className="text-sm text-fog">Высота</div><input type="number" value={el.height||100} onChange={e=>updateProp({height:Number(e.target.value)})} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/></div>
        </div>
      </div>
    )
  }

  const uploadImg = (e) => onFile(e)

  return (
    <div className="grid lg:grid-cols-[320px_1fr_320px] gap-5">
      <div className="space-y-3">
        <Toolbar
          onAddText={addText}
          onUpload={onUpload}
          onFlip={onFlip}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onBringF={onBringF}
          onSendB={onSendB}
          onAlign={onAlign}
          selected={selected}
          setProp={updateProp}
          side={side}
          setSide={setSide}
          exportPNG={() => {
            const uri = stageRef.current.toDataURL({ pixelRatio: 2 })
            onAddToCart?.(uri)
          }}
          grid={grid}
          setGrid={setGrid}
        />
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-sm text-fog mb-1">Цвет футболки</div>
          <input type="color" value={shirtColor} onChange={e=>setShirtColor(e.target.value)} className="w-12 h-8 rounded"/>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-center">
        <div className="relative" style={{width:PRINT_W, height:PRINT_H}}>
          <Stage width={PRINT_W} height={PRINT_H} ref={stageRef}>
            <Layer>
              <Rect x={0} y={0} width={PRINT_W} height={PRINT_H} fill={shirtColor} cornerRadius={20}/>
              {grid && (
                <>
                  {/* Safe area */}
                  <Rect x={SAFE_INSET} y={SAFE_INSET} width={PRINT_W-2*SAFE_INSET} height={PRINT_H-2*SAFE_INSET} stroke="#ffffff22" dash={[6,6]} cornerRadius={12}/>
                  {/* Center lines */}
                  <Line points={[PRINT_W/2, 20, PRINT_W/2, PRINT_H-20]} stroke="#ffffff18" />
                  <Line points={[20, PRINT_H/2, PRINT_W-20, PRINT_H/2]} stroke="#ffffff18" />
                </>
              )}
              {(active).map(el => (
                el.type==='image'
                ? <DraggableImage key={el.id} el={el} selected={selected===el.id} setSelected={setSelected} setActive={setActive}/>
                : <DraggableText key={el.id} el={el} selected={selected===el.id} setSelected={setSelected} setActive={setActive}/>
              ))}
            </Layer>
          </Stage>
        </div>
      </div>

      <div className="space-y-3">
        <SelectedPanel/>
        <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={uploadImg}/>
      </div>
    </div>
  )
}

function DraggableImage({ el, selected, setSelected, setActive }) {
  const image = useImage(el.src)
  return (
    <Group
      x={el.x} y={el.y}
      draggable
      onClick={()=>setSelected(el.id)}
      onTap={()=>setSelected(el.id)}
      onDragMove={e=>{
        const node = e.target
        setActive(a => a.map(i => i.id===el.id ? {...i, x: node.x(), y: node.y()} : i))
      }}
      rotation={el.rotation}
      opacity={el.opacity}
      scaleX={el.flipX ? -el.scaleX : el.scaleX}
      scaleY={el.scaleY}
    >
      <KImage image={image} width={el.width} height={el.height} />
      {selected && <Rect x={0} y={0} width={el.width} height={el.height} stroke="#d4af37" dash={[6,6]}/>}
    </Group>
  )
}

function DraggableText({ el, selected, setSelected, setActive }) {
  return (
    <Group
      x={el.x} y={el.y}
      draggable
      onClick={()=>setSelected(el.id)}
      onTap={()=>setSelected(el.id)}
      onDragMove={e=>{
        const node = e.target
        setActive(a => a.map(i => i.id===el.id ? {...i, x: node.x(), y: node.y()} : i))
      }}
      rotation={el.rotation}
      opacity={el.opacity}
      scaleX={el.flipX ? -el.scaleX : el.scaleX}
      scaleY={el.scaleY}
    >
      <KText text={el.text} fontSize={el.fontSize} fill={el.fill} stroke={el.stroke} strokeWidth={el.strokeWidth}/>
      {selected && <Rect x={-6} y={-6} width={el.text.length * el.fontSize * 0.6} height={el.fontSize+12} stroke="#d4af37" dash={[6,6]}/>}
    </Group>
  )
}
