-- Oldify — Storage pour photos d'annonces
-- À exécuter dans Supabase : SQL Editor → New query → Run
--
-- Crée un bucket `annonces` public et des policies très permissives (mode démo).
-- En prod, il faut resserrer ces policies (auth.uid(), etc.).

-- Bucket public
insert into storage.buckets (id, name, public)
values ('annonces', 'annonces', true)
on conflict (id) do update set public = true;

-- Policies (démo): lecture et upload publics sur ce bucket
drop policy if exists "annonces_bucket_read" on storage.objects;
create policy "annonces_bucket_read"
  on storage.objects for select
  using (bucket_id = 'annonces');

drop policy if exists "annonces_bucket_insert" on storage.objects;
create policy "annonces_bucket_insert"
  on storage.objects for insert
  with check (bucket_id = 'annonces');

drop policy if exists "annonces_bucket_update" on storage.objects;
create policy "annonces_bucket_update"
  on storage.objects for update
  using (bucket_id = 'annonces');

