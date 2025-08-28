import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, addDoc, updateDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore'

// Firebase config from user
const firebaseConfig = {
  apiKey: "AIzaSyBZBJGyMbPKSBhpwqBSiqq95azlOxFhOV0",
  authDomain: "soul-russia.firebaseapp.com",
  projectId: "soul-russia",
  storageBucket: "soul-russia.firebasestorage.app",
  messagingSenderId: "822287667421",
  appId: "1:822287667421:web:ca8da5f73bbafdaa7f4b34",
  measurementId: "G-3X688K16HM"
}

const app = initializeApp(firebaseConfig)
analyticsSupported().then((ok)=>{ if(ok) getAnalytics(app) }).catch(()=>{})

export const auth = getAuth(app)
export const db = getFirestore(app)

export const ensureAnonAuth = () => new Promise((resolve) => {
  const unsub = onAuthStateChanged(auth, (u) => { if (u) { unsub(); resolve(u) } })
  signInAnonymously(auth).catch(()=>{})
})

export async function fetchProducts() {
  // listen live
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
  return new Promise((resolve) => {
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      resolve({ items, unsub })
    })
  })
}

export async function upsertProduct(p) {
  const ref = doc(collection(db, 'products'))
  await setDoc(ref, { ...p, createdAt: Date.now() })
  return ref.id
}

export async function saveCart(uid, cart) {
  const ref = doc(db, 'carts', uid)
  await setDoc(ref, { cart, updatedAt: Date.now() }, { merge: true })
}

export async function loadCart(uid) {
  const ref = doc(db, 'carts', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data().cart || []) : []
}

export async function createOrder(uid, payload) {
  const ref = await addDoc(collection(db, 'orders'), { uid, ...payload, createdAt: Date.now(), status: 'new' })
  return ref.id
}
