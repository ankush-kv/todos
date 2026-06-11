-- Move off Supabase Auth: introduce a local users table and re-point
-- projects/todos ownership at it, dropping the auth.users coupling and RLS.
-- Access is now scoped in application code via the session user id.

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

-- Owner-only RLS relied on auth.uid(); it no longer applies.
drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;
drop policy if exists "todos_select_own" on public.todos;
drop policy if exists "todos_insert_own" on public.todos;
drop policy if exists "todos_update_own" on public.todos;
drop policy if exists "todos_delete_own" on public.todos;

alter table public.projects disable row level security;
alter table public.todos disable row level security;

-- Drop the auth.uid() defaults and the foreign keys into auth.users.
alter table public.projects alter column user_id drop default;
alter table public.todos alter column user_id drop default;

alter table public.projects drop constraint if exists projects_user_id_fkey;
alter table public.todos drop constraint if exists todos_user_id_fkey;

-- Any rows still referencing the abandoned auth.users would orphan here.
-- The app had no production data yet, so clear them before re-pointing.
delete from public.todos;
delete from public.projects;

-- Re-point ownership at the new public.users table.
alter table public.projects
  add constraint projects_user_id_fkey
  foreign key (user_id) references public.users (id) on delete cascade;
alter table public.todos
  add constraint todos_user_id_fkey
  foreign key (user_id) references public.users (id) on delete cascade;
