# Todos

A personal todo manager built with Next.js 16, Supabase (Postgres + Auth), and Tailwind CSS.

## Features

- Email/password authentication (login, register, forgot password, reset password)
- Dashboard with project CRUD
- Todos per project with a kanban board (todo / in progress / completed)
- Drag and drop todos between columns, or use the checkbox to toggle completion
- Row level security: every user only sees their own projects and todos

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Configure `.env` — `DATABASE_URL`, `DIRECT_URL`, and `NEXT_PUBLIC_SUPABASE_URL` are already set. Paste your anon/publishable key into `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase dashboard → Project Settings → API Keys).

3. The database schema lives in `supabase/migrations/0001_init.sql`. It has already been applied; to re-apply:

   ```bash
   psql "$DIRECT_URL" -f supabase/migrations/0001_init.sql
   ```

4. In the Supabase dashboard under Authentication → URL Configuration, set the Site URL (e.g. `http://localhost:3000`) so confirmation and password-reset emails link back to the app.

5. Run the dev server:

   ```bash
   pnpm dev
   ```

## Structure

- `src/proxy.ts` — session refresh + route protection (Next 16 proxy, formerly middleware)
- `src/lib/supabase/` — server and browser Supabase clients
- `src/lib/actions/` — server actions for auth, projects, and todos
- `src/app/(auth)/` — login, register, forgot-password, reset-password pages
- `src/app/auth/confirm/` — handles links from Supabase auth emails
- `src/app/(app)/` — dashboard and project kanban pages
