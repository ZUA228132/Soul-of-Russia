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
  await setDoc(ref, { ...p, createdAt: Date.now() })
  return ref.id
}

export async function saveCart(uid, cart) {
  if (!firebaseOK || uid.startsWith('local-')) {
    // queue locally
    localStorage.setItem(LS_CARTQ, JSON.stringify({ uid, cart, t: Date.now() }))
    return
  }
  const ref = doc(db, 'carts', uid)
  await setDoc(ref, { cart, updatedAt: Date.now() }, { merge: true })
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
  const ref = await addDoc(collection(db, 'orders'), { uid, ...payload, createdAt: Date.now(), status: 'new' })
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
