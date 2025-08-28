import React, { useEffect, useState } from 'react'

export default function PWAInstallHint() {
  const [promptEvent, setPromptEvent] = useState(null)
  const [show, setShow] = useState(false)
  const isiOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

  useEffect(() => {
    const saved = localStorage.getItem('hidePwaHint') === '1'
    if (saved || isStandalone) return
    const onPrompt = (e) => { e.preventDefault(); setPromptEvent(e); setShow(true) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    // Show hint on iOS (no prompt)
    if (isiOS) setShow(true)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  if (!show) return null

  return (
    <div className="pwa-hint">
      {!promptEvent && isiOS ? (
        <div className="flex items-center gap-3">
          <span>📲</span>
          <div className="flex-1">
            <b>Установить как приложение</b><br/>
            Открой «Поделиться» → <i>На экран «Домой»</i>.
          </div>
          <button className="btn btn-ghost" onClick={()=>{ localStorage.setItem('hidePwaHint','1'); setShow(false) }}>Скрыть</button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span>📲</span>
          <div className="flex-1">
            <b>Установить как приложение</b><br/>
            Нажми «Установить» — будет работать как PWA.
          </div>
          <button className="btn btn-cta" onClick={async()=>{ await promptEvent.prompt(); localStorage.setItem('hidePwaHint','1'); setShow(false) }}>Установить</button>
        </div>
      )}
    </div>
  )
}
