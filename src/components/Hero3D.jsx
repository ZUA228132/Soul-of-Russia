import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export default function Hero3D() {
  const wrapRef = useRef(null)
  const overlayRef = useRef(null)
  const [enabled, setEnabled] = useState(true)
  const [ok, setOk] = useState(true)

  useEffect(() => {
    if (!enabled) return
    if (!window.WebGLRenderingContext) { setOk(false); return }
    const mount = wrapRef.current
    if (!mount) return
    const rect = () => ({ w: mount.clientWidth, h: mount.clientHeight })

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
    const { w, h } = rect()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setSize(w, h)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 100)
    camera.position.set(0, 0.2, 6)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const key = new THREE.DirectionalLight(0xFFD700, 1.2); key.position.set(5, 5, 5); scene.add(key)
    const rim = new THREE.PointLight(0xffffff, 0.7); rim.position.set(-3, -2, 4); scene.add(rim)

    // TorusKnot
    const geo = new THREE.TorusKnotGeometry(1.2, 0.32, 220, 35)
    const mat = new THREE.MeshStandardMaterial({ color: 0xC8A951, metalness: 0.9, roughness: 0.2, envMapIntensity: 1.0, emissive: 0x3a2a00, emissiveIntensity: 0.06 })
    const knot = new THREE.Mesh(geo, mat); scene.add(knot)

    // Particles
    const count = 1200
    const pgeo = new THREE.BufferGeometry()
    const positions = new Float32Array(count*3)
    for (let i=0;i<count;i++){
      const r = 3 + Math.random()*1.7
      const theta = Math.random()*Math.PI*2
      const phi = Math.acos(2*Math.random()-1)
      positions[3*i]   = r*Math.sin(phi)*Math.cos(theta)
      positions[3*i+1] = r*Math.cos(phi)*0.5
      positions[3*i+2] = r*Math.sin(phi)*Math.sin(theta)
    }
    pgeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pmaterial = new THREE.PointsMaterial({ color: 0xD4AF37, size: 0.02, transparent:true, opacity:0.75 })
    const points = new THREE.Points(pgeo, pmaterial)
    scene.add(points)

    // Cursor interaction
    let targetRotX = 0, targetRotY = 0
    const onMove = (e) => {
      const b = mount.getBoundingClientRect()
      const x = (e.clientX - b.left) / b.width
      const y = (e.clientY - b.top) / b.height
      targetRotY = (x - 0.5) * 0.8
      targetRotX = (0.5 - y) * 0.5
    }
    mount.addEventListener('pointermove', onMove)

    // GSAP ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mount,
        start: "top center",
        end: "bottom top",
        scrub: 1
      }
    })
    tl.to(knot.scale, { x: 1.15, y: 1.15, z: 1.15, ease: 'none' }, 0)
    tl.to(knot.rotation, { y: "+=1.2", ease: 'none' }, 0)
    tl.to(pmaterial, { opacity: 1.0, ease: 'none' }, 0)
    tl.to(camera.position, { z: 5.5, ease: 'none' }, 0)

    const overlay = overlayRef.current
    if (overlay) {
      gsap.fromTo(overlay, { opacity: 0.0 }, {
        opacity: 0.15,
        scrollTrigger: { trigger: mount, start: "top center", end: "bottom top", scrub: 1 }
      })
    }

    let raf, t = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      t += 0.01
      knot.rotation.x += (targetRotX - knot.rotation.x) * 0.08
      knot.rotation.y += (targetRotY - knot.rotation.y) * 0.08
      knot.rotation.z += 0.0025
      points.rotation.y -= 0.0015
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const { w, h } = rect()
      renderer.setSize(w, h)
      camera.aspect = w/h; camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)

    return () => {
      mount.removeEventListener('pointermove', onMove)
      ScrollTrigger.getAll().forEach(t=>t.kill())
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
      while (mount.firstChild) mount.removeChild(mount.firstChild)
    }
  }, [enabled])

  return (
    <div className="relative">
      <div className="aspect-[4/3] rounded-3xl gradient-border overflow-hidden shadow-glow">
        <div ref={wrapRef} className="w-full h-full"></div>
        <div ref={overlayRef} className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gold/10"></div>
        <div className="absolute top-3 right-3 z-10">
          <button onClick={()=>setEnabled(e=>!e)} className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-xs">
            3D: {enabled ? 'Вкл' : 'Выкл'}
          </button>
        </div>
      </div>
    </div>
  )
}
