import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
gsap.registerPlugin(ScrollTrigger)

function makeCanvasTexture(text = 'Душа Руси') {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1024
  const g = c.getContext('2d')
  g.fillStyle = '#e6e6e6'; g.fillRect(0,0,1024,1024)
  g.fillStyle = 'rgba(0,0,0,0.08)'
  for (let y=0;y<1024;y+=48){ for (let x=0;x<1024;x+=48){ g.beginPath(); g.arc(x+24,y+24,6,0,Math.PI*2); g.fill() } }
  g.font = 'bold 140px Unbounded, Arial'; g.fillStyle = '#0b0c10'; g.fillText(text, 80, 540)
  const tex = new THREE.CanvasTexture(c); tex.anisotropy = 8; return tex
}

export default function PinnedHero() {
  const containerRef = useRef(null)
  const threeRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const root = containerRef.current, wrap = threeRef.current
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0.7, 6)

    const resize = () => { const w=wrap.clientWidth, h=wrap.clientHeight; renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8)); renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix() }
    wrap.appendChild(renderer.domElement)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5)
    const key = new THREE.DirectionalLight(0xFFD700, 1.2); key.position.set(5,5,5)
    const rim = new THREE.PointLight(0xffffff, 0.7); rim.position.set(-3,-2,4)
    scene.add(ambient, key, rim)

    // Chapter 1 mesh: "logo" knot
    const knotGeo = new THREE.TorusKnotGeometry(1.1, 0.32, 220, 35)
    const knotMat = new THREE.MeshStandardMaterial({ color: 0xC8A951, metalness: 0.85, roughness: 0.25 })
    const knot = new THREE.Mesh(knotGeo, knotMat); scene.add(knot)

    // Chapter 2 mesh: GLTF shirt with texture "Душа Руси"
    let shirt = null
    const loader = new GLTFLoader()
    loader.load('/models/shirt.gltf', (gltf) => {
      shirt = gltf.scene
      shirt.traverse(obj=>{
        if (obj.isMesh) {
          obj.material = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.8, map: makeCanvasTexture('Душа Руси') })
        }
      })
      shirt.visible = false
      scene.add(shirt)
    })

    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top top', end: '+=300%', scrub: 1, pin: true }
    })

    // Chapter 1 → rotate gold knot
    tl.to(knot.rotation, { y: "+=1.2", ease:'none' }, 0)

    // Chapter 2 → swap to shirt + cool lighting
    tl.add(() => { if (shirt){ shirt.visible = true; knot.visible = false }}, ">")
    tl.to(key.color, { r: 0.6, g: 0.8, b: 1.0, duration: 0.4 }, "<")
    tl.to(camera.position, { z: 5.2, duration: 0.4 }, "<")

    // Chapter 3 → soft white + collab overlay
    tl.to(key.color, { r: 1, g: 1, b: 1, duration: 0.4 }, ">")
    tl.to(knotMat, { color: 0xffffff, metalness: 0.2, roughness: 0.6, duration: 0.4 }, "<")
    if (overlayRef.current) tl.to(overlayRef.current, { opacity: 1, duration: 0.4 }, "<")

    const ro = new ResizeObserver(resize); ro.observe(wrap)
    let raf; const loop = () => { raf = requestAnimationFrame(loop); renderer.render(scene, camera) }; loop()
    return () => { ScrollTrigger.getAll().forEach(t=>t.kill()); cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); while (wrap.firstChild) wrap.removeChild(wrap.firstChild) }
  }, [])

  return (
    <section ref={containerRef} className="relative border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="font-display text-4xl md:text-6xl font-extrabold leading-[1.05]">
            <span className="bg-gradient-title bg-clip-text text-transparent">Футболки, в которых слышно сердце</span>
          </h1>
          <p className="mt-5 text-fog text-lg max-w-prose">Пиннинг-хиро в три главы: золотое лого → 3D‑футболка «Душа Руси» → коллаборация со <b>SNAISIX</b>.</p>
          <div className="mt-7 flex items-center gap-3">
            <button onClick={()=>document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'})} className="btn btn-cta">К коллекции</button>
            <span className="badge">✓ Премиум хлопок 190 г/м²</span>
          </div>
        </div>
        <div className="relative">
          <div ref={threeRef} className="aspect-[4/3] rounded-2xl border border-white/10 overflow-hidden"></div>
          <div ref={overlayRef} style={{opacity:0}} className="pointer-events-none absolute inset-0 p-4 md:p-6">
            <div className="absolute top-3 right-3"><span className="badge bg-twitch/20 border-twitch/30">Коллаборация</span></div>
            <div className="absolute bottom-4 left-4 right-4 md:left-6 md:right-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-4">
              <div className="flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 240 240" aria-hidden>
                  <rect width="200" height="160" x="20" y="40" rx="20" fill="#9146FF"/>
                  <rect width="40" height="40" x="60" y="90" fill="#0d0f12"/>
                  <rect width="40" height="40" x="126" y="90" fill="#0d0f12"/>
                  <polygon points="160,200 120,200 90,228 90,200 20,200 20,40 220,40 220,180" fill="#9146FF"/>
                </svg>
                <div className="font-semibold">SNAISIX</div>
                <a className="link" target="_blank" href="https://twitch.tv/SNAISIX" rel="noreferrer">Смотреть на Twitch</a>
              </div>
              <div className="text-sm text-fog mt-1">Экслюзивные дропы, анонсы на стримах, спец‑принты.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
