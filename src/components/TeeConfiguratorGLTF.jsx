import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function makeCanvasTexture({ baseColor = '#e6e6e6', pattern = 'none', text = 'Душа Руси', logo = null, tint = '#ffffff' }) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1024
  const g = c.getContext('2d')
  g.fillStyle = baseColor; g.fillRect(0,0,1024,1024)
  g.fillStyle = 'rgba(255,255,255,0.02)'; for (let y=0; y<1024; y+=2) g.fillRect(0,y,1024,1)
  if (pattern === 'waves') { g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 3; for (let y=100; y<900; y+=40){ g.beginPath(); for (let x=0; x<=1024; x+=16){ const yy = y + Math.sin((x/1024)*Math.PI*4)*10; if (x===0) g.moveTo(x,yy); else g.lineTo(x,yy) } g.stroke() } }
  if (pattern === 'geo') { g.fillStyle = 'rgba(0,0,0,0.12)'; for (let y=0;y<1024;y+=48){ for (let x=0;x<1024;x+=48){ g.beginPath(); g.arc(x+24,y+24,6,0,Math.PI*2); g.fill() } } }
  if (pattern === 'snx') { g.fillStyle = 'rgba(145,70,255,0.12)'; for (let y=0;y<1024;y+=64){ for (let x=0;x<1024;x+=64){ g.font='bold 18px Inter'; g.fillText('SNAISIX', x+6, y+32) } } }
  g.fillStyle = tint; g.globalAlpha = 0.15; g.fillRect(0,0,1024,1024); g.globalAlpha = 1
  if (text) { g.font='bold 120px Unbounded, Arial'; g.fillStyle='rgba(0,0,0,0.8)'; g.fillText(text, 80, 520) }
  if (logo) { const img = logo; const size=300; g.drawImage(img, 1024-size-80, 80, size, size) }
  const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.anisotropy=8; return tex
}

export default function TeeConfiguratorGLTF({ onDone }) {
  const mountRef = useRef(null)
  const [baseColor, setBaseColor] = useState('#e6e6e6')
  const [pattern, setPattern] = useState('waves')
  const [tint, setTint] = useState('#ffffff')
  const [text, setText] = useState('Душа Руси')
  const logoRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0.7, 6)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.enablePan = false

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    const dir = new THREE.DirectionalLight(0xffffff, 1.0); dir.position.set(5,5,5)
    scene.add(ambient, dir)

    const loader = new GLTFLoader()
    let meshList = []
    loader.load('/models/shirt.gltf', (gltf) => {
      gltf.scene.traverse(obj => {
        if (obj.isMesh) {
          obj.material = new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.1, roughness: 0.8, map: makeCanvasTexture({ baseColor, pattern, text, logo: logoRef.current, tint }) })
          meshList.push(obj)
        }
      })
      scene.add(gltf.scene)
      updateTexture()
    })

    const resize = () => { const w=mount.clientWidth, h=mount.clientHeight; renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8)); renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix() }
    mount.appendChild(renderer.domElement)
    const ro = new ResizeObserver(resize); ro.observe(mount)

    let raf; const loop = () => { raf = requestAnimationFrame(loop); controls.update(); renderer.render(scene, camera) }; loop()

    const updateTexture = () => {
      const t = makeCanvasTexture({ baseColor, pattern, text, logo: logoRef.current, tint })
      meshList.forEach(m => { m.material.map?.dispose(); m.material.map = t; m.material.needsUpdate = true })
    }
    TeeConfiguratorGLTF._update = updateTexture

    return () => { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); while (mount.firstChild) mount.removeChild(mount.firstChild) }
  }, [])

  useEffect(() => { TeeConfiguratorGLTF._update && TeeConfiguratorGLTF._update() }, [baseColor, pattern, text, tint])

  const onLogo = (e) => { const f = e.target.files?.[0]; if (!f) return; const img = new Image(); img.onload = () => { logoRef.current = img; TeeConfiguratorGLTF._update && TeeConfiguratorGLTF._update() }; img.src = URL.createObjectURL(f) }

  const addToCart = () => {
    const item = { id: crypto.randomUUID(), title: `Кастомная футболка (${pattern})`, price: 3490, images: [], custom: { baseColor, pattern, text } }
    onDone?.(item)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden" ref={mountRef}></div>
      <div className="space-y-3">
        <div className="text-sm text-fog">Цвет основы</div>
        <input type="color" value={baseColor} onChange={e=>setBaseColor(e.target.value)} className="w-12 h-8 rounded"/>
        <div className="text-sm text-fog">Паттерн</div>
        <div className="flex gap-2">{['waves','geo','snx','none'].map(p => (<button key={p} onClick={()=>setPattern(p)} className={`badge ${pattern===p?'bg-white/10':''}`}>{p}</button>))}</div>
        <div className="text-sm text-fog">Тонировка ткани</div>
        <input type="color" value={tint} onChange={e=>setTint(e.target.value)} className="w-12 h-8 rounded"/>
        <div className="text-sm text-fog">Кастомный текст</div>
        <input value={text} onChange={e=>setText(e.target.value)} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none text-sm"/>
        <div className="text-sm text-fog">Логотип</div>
        <input type="file" accept="image/*" onChange={onLogo}/>
        <div className="pt-2"><button onClick={addToCart} className="btn btn-cta">Добавить в корзину</button></div>
      </div>
    </div>
  )
}
