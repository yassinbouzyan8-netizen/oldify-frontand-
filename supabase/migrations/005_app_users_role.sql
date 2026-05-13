-- Rôle applicatif (auth custom). Les comptes existants restent "user".

alter table public.app_users
  add column if not exists role text not null default 'user';

alter table public.app_users
  drop constraint if exists app_users_role_check;

alter table public.app_users
  add constraint app_users_role_check check (role in ('user', 'admin'));

comment on column public.app_users.role is 'Rôle Oldify: user | admin.';
