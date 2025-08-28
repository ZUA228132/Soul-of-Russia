# Push через Firebase Cloud Messaging (PWA)

1) В консоли Firebase → **Project Settings → Cloud Messaging** → **Web Push certificates** → сгенерируй ключ и скопируй **VAPID key**.
2) Добавь в Vercel переменную окружения: `VITE_FIREBASE_VAPID_KEY = <твой ключ>`.
3) В консоли Firebase → Authentication → Settings → **Authorized domains** → добавь `soul-of-russia.vercel.app`.
4) В проекте уже есть:
   - `public/firebase-messaging-sw.js` — сервис-воркер для фоновых пушей,
   - `src/firebaseMessaging.js` — запрос разрешения, получение токена и запись в `push_tokens`,
   - кнопка «Подключить пуш-уведомления» в футере (скрытом меню).
5) Отправить тест можно из **Firebase console → Cloud Messaging → Send test message** → добавь токен, который покажет алерт после нажатия кнопки.
