-- Oldify — annonces (stockage réel des annonces en base)
-- À exécuter dans Supabase : SQL Editor → New query → Run
--
-- Extension requise pour gen_random_uuid()
create extension if not exists pgcrypto;

create table if not exists public.annonces (
  id uuid primary key default gen_random_uuid(),
  owner_id text not null,
  title text not null,
  category text not null,
  condition text not null,
  description text not null,
  price numeric not null,
  city text not null,
  delivery boolean not null default true,
  images text[] not null default '{}',
  status text not null default 'en-ligne',
  created_at timestamptz not null default now()
);

comment on table public.annonces is 'Annonces Oldify créées depuis /vendre.';

create index if not exists annonces_owner_id_idx on public.annonces(owner_id);
create index if not exists annonces_created_at_idx on public.annonces(created_at desc);

alter table public.annonces enable row level security;

-- Mode démo : lecture publique. En prod, resserrer selon tes besoins.
drop policy if exists "annonces_select_all" on public.annonces;
create policy "annonces_select_all"
  on public.annonces for select
  using (true);

-- Si tu utilises Supabase Auth plus tard, tu pourras remplacer owner_id par auth.uid().
drop policy if exists "annonces_insert_owner" on public.annonces;
create policy "annonces_insert_owner"
  on public.annonces for insert
  with check (true);

drop policy if exists "annonces_update_owner" on public.annonces;
create policy "annonces_update_owner"
  on public.annonces for update
  using (true);

grant usage on schema public to anon, authenticated;
grant select on public.annonces to anon, authenticated;
-- Mode démo : autoriser l'insertion aussi avec la clé publique (anon/publishable).
-- En prod, retire ça et utilise un vrai backend + RLS stricte.
grant insert, update on public.annonces to anon, authenticated;
