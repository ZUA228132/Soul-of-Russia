import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBZBJGyMbPKSBhpwqBSiqq95azlOxFhOV0",
  authDomain: "soul-russia.firebaseapp.com",
  projectId: "soul-russia",
  storageBucket: "soul-russia.firebasestorage.app",
  messagingSenderId: "822287667421",
  appId: "1:822287667421:web:ca8da5f73bbafdaa7f4b34",
  measurementId: "G-3X688K16HM"
}

// separate app to avoid circular deps
const app = initializeApp(firebaseConfig, 'messaging-app')
const db = getFirestore(app)
const auth = getAuth() // default app auth

export async function initMessaging(vapidKey) {
  const supported = await isSupported().catch(()=>false)
  if (!supported) return { supported:false, error:'Браузер не поддерживает Web Push' }

  if (!('serviceWorker' in navigator)) return { supported:false, error:'Service Worker недоступен' }
  if (!vapidKey || vapidKey.length < 30) return { supported:false, error:'VAPID key пустой или некорректен' }

  // 1) регистрируем SW (отдельный от PWA), чтобы Chrome знал откуда брать пуши
  const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(e=>{ throw new Error('SW register failed: '+e) })

  const messaging = getMessaging(app)
  try {
    // 2) получаем токен, обязательно указывая registration и vapidKey
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg })
    if (!token) return { supported:true, token:null, error:'Не получили токен (user denied?)' }

    const uid = auth?.currentUser?.uid || 'anon'
    await setDoc(doc(db, 'push_tokens', token), {
      uid, token, createdAt: Date.now(), ua: navigator.userAgent
    }, { merge: true })

    onMessage(messaging, (payload) => console.log('[FCM] foreground message', payload))
    return { supported:true, token }
  } catch (e) {
    return { supported:true, token:null, error:String(e) }
  }
}
