-- Compte administrateur Oldify (à exécuter dans Supabase → SQL Editor).
-- Mot de passe : défini hors dépôt ; après exécution, connexion avec le mot de passe convenu avec l’équipe.
-- Hash généré avec le même algorithme que l’app (scrypt, voir src/lib/local-auth/crypto.ts).

insert into public.app_users (email, password_hash, full_name, role)
values (
  'brandmanagerstella@gmail.com',
  '0080faf4a266e2c92ddc78e9ce9a9944:dbf82fe841dcf0219e5ff4d711a914e084f1a6834313c474ef3fd4dfcbc717bbe3f2fcc18c13ab6302d303fe4890aef724bf72ed9c4c4d0c388a860466c6d1d3',
  'Brand Manager Stella',
  'admin'
)
on conflict (email) do update set
  password_hash = excluded.password_hash,
  full_name = excluded.full_name,
  role = excluded.role;

insert into public.app_profiles (user_id, email, full_name)
select u.id, u.email, u.full_name
from public.app_users u
where u.email = 'brandmanagerstella@gmail.com'
on conflict (user_id) do update set
  email = excluded.email,
  full_name = excluded.full_name;
