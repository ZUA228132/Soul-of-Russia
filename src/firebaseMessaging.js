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

// Use separate app instance to avoid cyclic imports
const app = initializeApp(firebaseConfig, 'messaging-app')
const db = getFirestore(app)
const auth = getAuth() // use default app auth
let messaging = null

export async function initMessaging(vapidKey) {
  const ok = await isSupported().catch(()=>false)
  if (!ok) return { supported:false }
  messaging = getMessaging(app)
  try {
    const token = await getToken(messaging, { vapidKey })
    const uid = auth?.currentUser?.uid || 'anon'
    if (token) {
      await setDoc(doc(db, 'push_tokens', token), {
        uid, token, createdAt: Date.now(), ua: navigator.userAgent
      }, { merge: true })
    }
    onMessage(messaging, (payload) => {
      // optional: show a toast in-app
      console.log('[FCM] foreground message', payload)
    })
    return { supported:true, token }
  } catch (e) {
    console.warn('[FCM] permission/token error', e)
    return { supported:true, token:null, error:String(e) }
  }
}
