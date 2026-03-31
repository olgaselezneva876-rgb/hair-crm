# Hair CRM

Минимальный каркас Next.js + Supabase для локального запуска.

## Запуск

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Создайте `.env.local` на основе `.env.example` и укажите ключи Supabase.
3. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
4. Откройте `http://localhost:3000`.

## Важные файлы

- `app/login.tsx` — страница входа через Supabase OTP.
- `lib/supabase.ts` — инициализация клиента Supabase.
