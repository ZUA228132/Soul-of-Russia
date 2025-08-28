import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, addDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBZBJGyMbPKSBhpwqBSiqq95azlOxFhOV0",
  authDomain: "soul-russia.firebaseapp.com",
  projectId: "soul-russia",
  storageBucket: "soul-russia.firebasestorage.app",
  messagingSenderId: "822287667421",
  appId: "1:822287667421:web:ca8da5f73bbafdaa7f4b34",
  measurementId: "G-3X688K16HM"
}

let app, auth, db
export let firebaseOK = false

// ---- Firestore sanitizers (v2) ----
const isPlain = (v) => Object.prototype.toString.call(v)==='[object Object]'
const isSerializable = (v) => (
  v === null ||
  ['string','number','boolean'].includes(typeof v) ||
  Array.isArray(v) ||
  isPlain(v)
)
// Convert any unsupported types (File/Blob/Date/Map/Set/function/etc.) to safe strings or null
const normalize = (v) => {
  if (v === undefined || Number.isNaN(v)) return null
  if (v === null) return null
  const t = typeof v
  if (t === 'string' || t === 'number' || t === 'boolean') return (typeof v==='string' && v.length>MAX_STR) ? v.slice(0,MAX_STR) : v
  if (Array.isArray(v)) return (typeof v==='string' && v.length>MAX_STR) ? v.slice(0,MAX_STR) : v.map(normalize)
  if (isPlain(v)) return Object.fromEntries(Object.entries(v).map(([k,val])=>[k, normalize(val)]))
  // Blob/File/Date/Map/Set/Function/DOM/etc.
  try {
    // keep data URLs as is
    if (t === 'object' && v && typeof v.toString === 'function') {
      const s = v.toString()
      // if looks like data URL
      if (typeof s === 'string' && s.startsWith('data:')) return s
      return String(s)
    }
  } catch {}
  return null
}
const cleanValue = (v) => normalize(v)
const pickItem = (it) => {
  let img = typeof it?.image === 'string' ? it.image : ''
  if (img.startsWith('data:') && img.length > 80000) img = '' // drop overweight inline images
  return {
    id: String(it?.id || ''),
    title: String(it?.title || ''),
    price: Number(it?.price || 0),
    image: img,
    qty: Number(it?.qty || 1)
  }
}

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  firebaseOK = true
} catch (e) {
  firebaseOK = false
}

const LS_UID = 'dr_uid'
const LS_CARTQ = 'dr_cart_queue'

export const ensureAnonAuth = () => new Promise((resolve) => {
  if (!firebaseOK) {
    const uid = localStorage.getItem(LS_UID) || ('local-' + crypto.randomUUID())
    localStorage.setItem(LS_UID, uid)
    return resolve({ uid })
  }
  try {
    const unsub = onAuthStateChanged(auth, (u) => { if (u) { unsub(); resolve(u) } })
    signInAnonymously(auth).catch(() => {
      const uid = localStorage.getItem(LS_UID) || ('local-' + crypto.randomUUID())
      localStorage.setItem(LS_UID, uid)
      resolve({ uid })
    })
  } catch {
    const uid = localStorage.getItem(LS_UID) || ('local-' + crypto.randomUUID())
    localStorage.setItem(LS_UID, uid)
    resolve({ uid })
  }
})

export async function fetchProducts() {
  if (!firebaseOK) return { items: JSON.parse(localStorage.getItem('dusha_rusi_products')||'[]'), unsub: () => {} }
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
  return new Promise((resolve) => {
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      resolve({ items, unsub })
    }, () => resolve({ items: [], unsub: () => {} }))
  })
}

export async function upsertProduct(p) {
  if (!firebaseOK) {
    const items = JSON.parse(localStorage.getItem('dusha_rusi_products')||'[]')
    items.unshift({ id: crypto.randomUUID(), ...p })
    localStorage.setItem('dusha_rusi_products', JSON.stringify(items))
    return items[0].id
  }
  const ref = doc(collection(db, 'products'))
  await safeWrite(ref, { ...p, images: (p.images||[]).map(x=> typeof x==='string'?x:String(x||'')), tags: (p.tags||[]).map(x=>String(x||'')), badges: (p.badges||[]).map(x=>String(x||'')), createdAt: Date.now() })
  return ref.id
}

export async function saveCart(uid, cart) {
  if (!firebaseOK || uid.startsWith('local-')) {
    // queue locally
    localStorage.setItem(LS_CARTQ, JSON.stringify({ uid, cart, t: Date.now() }))
    return
  }
  const ref = doc(db, 'carts', uid)
  await setDoc(ref, { cart: cleanValue(cart), updatedAt: Date.now() }, { merge: true })
}

export async function loadCart(uid) {
  if (!firebaseOK || uid.startsWith('local-')) {
    const q = JSON.parse(localStorage.getItem(LS_CARTQ)||'null')
    return q?.uid===uid ? (q.cart||[]) : []
  }
  const ref = doc(db, 'carts', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? (snap.data().cart || []) : []
}

export async function createOrder(uid, payload) {
  if (!firebaseOK || uid.startsWith('local-')) {
    const all = JSON.parse(localStorage.getItem('orders_local')||'[]')
    const id = 'local-' + crypto.randomUUID()
    all.unshift({ id, uid, ...payload, createdAt: Date.now(), status: 'new' })
    localStorage.setItem('orders_local', JSON.stringify(all))
    return id
  }
  const ref = await addDoc(collection(db, 'orders'), jsonSanitize(cleanValue({ uid, ...payload, items: (payload.items||[]).map(pickItem), createdAt: Date.now(), status: 'new' })))
  return ref.id
}

export async function fetchOrders(uidOnly = null) {
  if (!firebaseOK) {
    const all = JSON.parse(localStorage.getItem('orders_local')||'[]')
    return uidOnly ? all.filter(o=>o.uid===uidOnly) : all
  }
  // For brevity in this demo we read all orders; restrict in rules for production
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  return new Promise((resolve) => {
    const unsub = onSnapshot(q, (snap) => resolve(snap.docs.map(d=>({ id:d.id, ...d.data() }))), () => resolve([]))
  })
}


export function subscribeOrders(cb){
  if (!firebaseOK){ cb(JSON.parse(localStorage.getItem('orders_local')||'[]')); return ()=>{} }
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  const unsub = onSnapshot(q, (snap)=> cb(snap.docs.map(d=>({ id:d.id, ...d.data() }))), ()=>cb([]))
  return unsub
}

// ---- Final JSON sanitizer & safeWrite ----
const MAX_STR = 100000; // ~100KB cap for strings (avoid massive data URLs)
const jsonSanitize = (obj) => {
  const seen = new WeakSet()
  const rep = (k, v) => {
    if (typeof v === 'undefined' || Number.isNaN(v)) return null
    if (typeof v === 'function') return String(v.name || 'fn')
    if (typeof v === 'bigint') return Number(v)
    if (v instanceof Date) return (typeof v==='string' && v.length>MAX_STR) ? v.slice(0,MAX_STR) : v.toISOString()
    if (typeof Blob !== 'undefined' && v instanceof Blob) return null
    if (typeof File !== 'undefined' && v instanceof File) return null
    if (v && typeof v === 'object') {
      if (seen.has(v)) return '[Circular]'
      seen.add(v)
    }
    return (typeof v==='string' && v.length>MAX_STR) ? v.slice(0,MAX_STR) : v
  }
  try { return JSON.parse(JSON.stringify(obj, rep)) } catch { return null }
}

async function safeWrite(ref, data, opts={}) {
  const clean = cleanValue(data)
  const finalData = jsonSanitize(clean)
  if (finalData == null) throw new Error('Sanitize failed')
  return await setDoc(ref, finalData, opts)
}
