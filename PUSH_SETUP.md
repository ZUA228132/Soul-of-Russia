# Push через Firebase Cloud Messaging (PWA)

1) В консоли Firebase → **Project Settings → Cloud Messaging** → **Web Push certificates** → сгенерируй ключ и скопируй **VAPID key**.
2) Добавь в Vercel переменную окружения: `VITE_FIREBASE_VAPID_KEY = <твой ключ>`.
3) В консоли Firebase → Authentication → Settings → **Authorized domains** → добавь `soul-of-russia.vercel.app`.
4) В проекте уже есть:
   - `public/firebase-messaging-sw.js` — сервис-воркер для фоновых пушей,
   - `src/firebaseMessaging.js` — запрос разрешения, получение токена и запись в `push_tokens`,
   - кнопка «Подключить пуш-уведомления» в футере (скрытом меню).
5) Отправить тест можно из **Firebase console → Cloud Messaging → Send test message** → добавь токен, который покажет алерт после нажатия кнопки.

## Отладка «401 token-subscribe-failed»
- Проверь, что в Vercel задана переменная **VITE_FIREBASE_VAPID_KEY** и сделан redeploy.
- Убедись, что **firebase-messaging-sw.js** доступен по корню сайта (открой /firebase-messaging-sw.js в браузере).
- В **Project Settings → Cloud Messaging → Web Push certificates** должен быть Key pair.
- В **Auth → Settings → Authorized domains** должен быть домен деплоя.
- Если тестируешь в iOS — пуши приходят только для **установленной ПВА** (Add to Home Screen).
