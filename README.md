# Душа Руси — Variant E2 (Fix pack)

Исправления:
- Вернул **слоган** в отдельном Hero-секции (HeroSlogan) + CollabHero ниже.
- Добавил **переключатель темы** (светлая/тёмная), сохранение выбора в localStorage.
- Мобильная **PWA‑подсказка**: Android — `beforeinstallprompt`, iOS — инструкция (Share → Add to Home Screen).
- Конструктор переписан: масштабирование Stage под контейнер (адаптив), Transformer‑ручки, клип по зоне печати, силуэт футболки + корректный экспорт PNG.
- UX: стрелки двигают слои, Delete/Backspace удаляет, безопасная зона и направляющие.

Запуск:
npm i
npm run dev
npm run build  # для деплоя на Vercel (dist/)
