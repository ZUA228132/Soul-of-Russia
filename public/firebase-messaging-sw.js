// Firebase Messaging SW (background notifications)
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyBZBJGyMbPKSBhpwqBSiqq95azlOxFhOV0",
  authDomain: "soul-russia.firebaseapp.com",
  projectId: "soul-russia",
  storageBucket: "soul-russia.firebasestorage.app",
  messagingSenderId: "822287667421",
  appId: "1:822287667421:web:ca8da5f73bbafdaa7f4b34",
  measurementId: "G-3X688K16HM"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function(payload) {
  const title = payload.notification?.title || 'Душа Руси'
  const options = {
    body: payload.notification?.body || '',
    icon: payload.notification?.icon || '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    data: payload.data || {}
  }
  self.registration.showNotification(title, options)
})
