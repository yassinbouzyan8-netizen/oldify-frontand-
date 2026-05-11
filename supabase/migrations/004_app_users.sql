-- Oldify — Auth custom (sans Supabase Auth)
-- Table users + profils, gérés par les API routes Next.js.
-- À exécuter dans Supabase : SQL Editor → New query → Run

create extension if not exists pgcrypto;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text,
  created_at timestamptz not null default now()
);

comment on table public.app_users is 'Users Oldify (auth custom).';

create table if not exists public.app_profiles (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

comment on table public.app_profiles is 'Profils Oldify (auth custom).';

alter table public.app_users enable row level security;
alter table public.app_profiles enable row level security;

-- On bloque tout côté client : l’accès se fait via les API routes serveur (service role).
drop policy if exists "deny_all_users" on public.app_users;
create policy "deny_all_users" on public.app_users for all using (false) with check (false);

drop policy if exists "deny_all_profiles" on public.app_profiles;
create policy "deny_all_profiles" on public.app_profiles for all using (false) with check (false);

