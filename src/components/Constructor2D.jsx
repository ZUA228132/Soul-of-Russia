import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Stage, Layer, Rect, Group, Image as KImage, Text as KText, Line, Transformer, Shape } from 'react-konva'

const BASE_W = 800, BASE_H = 1000
const SAFE = 60
const PRINT_W = BASE_W - SAFE*2, PRINT_H = BASE_H - SAFE*2

function useImage(src) {
  const [image, setImage] = useState(null)
  useEffect(() => { if (!src) return; const img = new window.Image(); img.crossOrigin='anonymous'; img.onload=()=>setImage(img); img.src=src }, [src])
  return image
}

function TeeSilhouette({ color }) {
  return (
    <Shape
      sceneFunc={(ctx, shape) => {
        const w = BASE_W, h = BASE_H
        const sleeve = 160, neckR = 70
        ctx.beginPath()
        // torso
        ctx.moveTo(sleeve, 120)
        ctx.lineTo(w - sleeve, 120)
        ctx.quadraticCurveTo(w - sleeve + 40, 200, w - 120, 300)
        ctx.lineTo(w - 120, h - 40)
        ctx.lineTo(120, h - 40)
        ctx.lineTo(120, 300)
        ctx.quadraticCurveTo(sleeve - 40, 200, sleeve, 120)
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()
        // neck
        ctx.globalCompositeOperation = 'destination-out'
        ctx.beginPath()
        ctx.arc(w/2, 140, neckR, 0, Math.PI*2)
        ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
        // seam
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(0,0,0,0.18)'
        ctx.lineWidth = 2
        ctx.arc(w/2, 140, neckR+6, Math.PI*0.9, Math.PI*0.1, true)
        ctx.stroke()
      }}
      listening={false}
    />
  )
}

function Toolbar({ onAddText, onUpload, side, setSide, exportPNG, grid, setGrid }) {
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
      <button className="btn btn-cta" onClick={exportPNG}>В корзину (PNG)</button>
    </div>
  )
}

export default function Constructor2D({ onAddToCart }) {
  const [side, setSide] = useState('front')
  const [front, setFront] = useState([])
  const [back, setBack] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [shirtColor, setShirtColor] = useState('#e6e6e6')
  const [grid, setGrid] = useState(true)

  const active = side === 'front' ? front : back
  const setActive = side === 'front' ? setFront : setBack

  const stageRef = useRef(null)
  const layerRef = useRef(null)
  const trRef = useRef(null)
  const wrapperRef = useRef(null)
  const fileRef = useRef(null)

  const [scale, setScale] = useState(1)
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const w = wrapperRef.current.clientWidth
      const h = Math.min(600, window.innerHeight * 0.6)
      const s = Math.min(w / BASE_W, h / BASE_H)
      setScale(s)
    })
    ro.observe(wrapperRef.current)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    stage.width(BASE_W * scale)
    stage.height(BASE_H * scale)
    stage.scale({ x: scale, y: scale })
  }, [scale])

  useEffect(() => {
    const stage = stageRef.current
    const sel = selectedId ? stage.findOne(`.node-${selectedId}`) : null
    trRef.current.nodes(sel ? [sel] : [])
    trRef.current.getLayer().batchDraw()
  }, [selectedId, front, back, side])

  const addText = () => {
    const id = crypto.randomUUID()
    setActive(a => [...a, { id, type: 'text', text:'Душа Руси', x: SAFE+40, y: SAFE+40, fontSize: 48, rotation:0, scaleX:1, scaleY:1, fill:'#0b0c10', stroke:'#000', strokeWidth:0, opacity:1 }])
    setSelectedId(id)
  }
  const onUpload = () => fileRef.current?.click()
  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    const url = URL.createObjectURL(f)
    const id = crypto.randomUUID()
    setActive(a => [...a, { id, type:'image', src:url, x: SAFE+80, y: SAFE+80, width:300, height:300, rotation:0, scaleX:1, scaleY:1, opacity:1 }])
    setSelectedId(id)
    e.target.value=''
  }

  // Keyboard small nudges
  useEffect(() => {
    const onKey = (e) => {
      if (!selectedId) return
      const delta = e.shiftKey ? 10 : 2
      if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
        e.preventDefault()
        setActive(a => a.map(el => el.id===selectedId ? {...el, x: el.x + (e.key==='ArrowLeft'?-delta:e.key==='ArrowRight'?delta:0), y: el.y + (e.key==='ArrowUp'?-delta:e.key==='ArrowDown'?delta:0)} : el))
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        setActive(a => a.filter(el => el.id !== selectedId))
        setSelectedId(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, side])

  const dragBound = (pos, el) => {
    const w = (el.width||100) * (el.scaleX||1), h = (el.height|| (el.fontSize||40)) * (el.scaleY||1)
    const minX = SAFE, minY = SAFE, maxX = BASE_W - SAFE - w, maxY = BASE_H - SAFE - h
    return { x: Math.min(Math.max(pos.x, minX), maxX), y: Math.min(Math.max(pos.y, minY), maxY) }
  }

  const exportPNG = () => {
    const uri = stageRef.current.toDataURL({ pixelRatio: 1/scale }) // export at BASE size
    onAddToCart?.(uri)
  }

  const SelectedPanel = () => {
    const el = active.find(e=>e.id===selectedId)
    if (!el) return null
    return (
      <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="text-sm text-fog">Слой: <b>{el.type}</b></div>
        {el.type==='text' && (
          <>
            <div className="text-sm text-fog">Текст</div>
            <input value={el.text} onChange={e=>setActive(a=>a.map(x=>x.id===el.id?{...x, text:e.target.value}:x))} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/>
            <div className="grid grid-cols-2 gap-2">
              <div><div className="text-sm text-fog">Размер</div><input type="number" value={el.fontSize} onChange={e=>setActive(a=>a.map(x=>x.id===el.id?{...x, fontSize:Number(e.target.value)}:x))} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/></div>
              <div><div className="text-sm text-fog">Цвет</div><input type="color" value={el.fill} onChange={e=>setActive(a=>a.map(x=>x.id===el.id?{...x, fill:e.target.value}:x))} className="w-full h-10 rounded"/></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><div className="text-sm text-fog">Контур</div><input type="color" value={el.stroke} onChange={e=>setActive(a=>a.map(x=>x.id===el.id?{...x, stroke:e.target.value}:x))} className="w-full h-10 rounded"/></div>
              <div><div className="text-sm text-fog">Толщина</div><input type="number" value={el.strokeWidth} onChange={e=>setActive(a=>a.map(x=>x.id===el.id?{...x, strokeWidth:Number(e.target.value)}:x))} className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/></div>
            </div>
          </>
        )}
        <div className="grid grid-cols-2 gap-2">
          <div><div className="text-sm text-fog">Прозрачность</div><input type="range" min="0" max="1" step="0.01" value={el.opacity} onChange={e=>setActive(a=>a.map(x=>x.id===el.id?{...x, opacity:Number(e.target.value)}:x))}/></div>
          <div><div className="text-sm text-fog">Поворот</div><input type="range" min="-180" max="180" value={el.rotation} onChange={e=>setActive(a=>a.map(x=>x.id===el.id?{...x, rotation:Number(e.target.value)}:x))}/></div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[320px_1fr_320px] gap-5">
      <div className="space-y-3">
        <Toolbar onAddText={addText} onUpload={onUpload} side={side} setSide={setSide} exportPNG={exportPNG} grid={grid} setGrid={setGrid}/>
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-sm text-fog mb-1">Цвет футболки</div>
          <input type="color" value={shirtColor} onChange={e=>setShirtColor(e.target.value)} className="w-12 h-8 rounded"/>
        </div>
      </div>

      <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-center">
        <div ref={wrapperRef} className="w-full">
          <Stage ref={stageRef} width={BASE_W} height={BASE_H}>
            <Layer ref={layerRef}>
              <TeeSilhouette color={shirtColor}/>

              {grid && (
                <>
                  <Rect x={SAFE} y={SAFE} width={PRINT_W} height={PRINT_H} stroke="#ffffff22" dash={[6,6]} cornerRadius={12}/>
                  <Line points={[BASE_W/2, 20, BASE_W/2, BASE_H-20]} stroke="#ffffff18" />
                  <Line points={[20, BASE_H/2, BASE_W-20, BASE_H/2]} stroke="#ffffff18" />
                </>
              )}

              {/* Print area clipped */}
              <Group clipFunc={ctx => { ctx.beginPath(); ctx.roundRect(SAFE, SAFE+60, PRINT_W, PRINT_H-140, 12); }}>
                {active.map(el => el.type==='image' ? (
                  <NodeImage key={el.id} el={el} selected={selectedId===el.id} setSelected={setSelectedId} setActive={setActive} dragBound={dragBound} />
                ) : (
                  <NodeText key={el.id} el={el} selected={selectedId===el.id} setSelected={setSelectedId} setActive={setActive} dragBound={dragBound} />
                ))}
              </Group>

              <Transformer ref={trRef} rotateEnabled={true} enabledAnchors={['top-left','top-right','bottom-left','bottom-right','middle-left','middle-right','top-center','bottom-center']}
                boundBoxFunc={(oldBox, newBox) => {
                  // limit min size
                  if (Math.abs(newBox.width) < 40 || Math.abs(newBox.height) < 40) return oldBox
                  return newBox
                }}/>
            </Layer>
          </Stage>
        </div>
      </div>

      <div className="space-y-3">
        <SelectedPanel/>
        <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={onFile}/>
      </div>
    </div>
  )
}

function NodeImage({ el, selected, setSelected, setActive, dragBound }) {
  const image = useImage(el.src)
  const onDrag = (e) => { const node = e.target; setActive(a => a.map(i => i.id===el.id ? {...i, x: node.x(), y: node.y()} : i)) }
  return (
    <KImage
      image={image}
      x={el.x} y={el.y} width={el.width} height={el.height}
      opacity={el.opacity}
      rotation={el.rotation}
      scaleX={el.scaleX} scaleY={el.scaleY}
      name={`node-${el.id}`}
      draggable
      onClick={()=>setSelected(el.id)}
      onTap={()=>setSelected(el.id)}
      dragBoundFunc={(pos)=>dragBound(pos, el)}
      onDragMove={onDrag}
      onTransformEnd={(e)=>{
        const node = e.target
        const scaleX = node.scaleX(), scaleY = node.scaleY()
        setActive(a => a.map(i => i.id===el.id ? {...i, x: node.x(), y: node.y(), width: Math.max(40, el.width*scaleX), height: Math.max(40, el.height*scaleY), rotation: node.rotation(), scaleX:1, scaleY:1} : i))
        node.scale({x:1,y:1})
      }}
    />
  )
}

function NodeText({ el, selected, setSelected, setActive, dragBound }) {
  return (
    <KText
      text={el.text}
      x={el.x} y={el.y}
      fontSize={el.fontSize}
      fill={el.fill}
      stroke={el.stroke}
      strokeWidth={el.strokeWidth}
      opacity={el.opacity}
      rotation={el.rotation}
      name={`node-${el.id}`}
      draggable
      onClick={()=>setSelected(el.id)}
      onTap={()=>setSelected(el.id)}
      dragBoundFunc={(pos)=>dragBound(pos, el)}
      onDragMove={(e)=>{ const node=e.target; setActive(a=>a.map(i=>i.id===el.id?{...i, x:node.x(), y:node.y()}:i)) }}
      onTransformEnd={(e)=>{
        const node=e.target
        const scaleX=node.scaleX(), scaleY=node.scaleY()
        setActive(a=>a.map(i=>i.id===el.id?{...i, x:node.x(), y:node.y(), fontSize: Math.max(12, el.fontSize*scaleY), rotation: node.rotation()} : i))
        node.scale({x:1,y:1})
      }}
    />
  )
}
