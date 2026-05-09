-- Oldify — profils utilisateurs (lié à auth.users)
-- À exécuter dans Supabase : SQL Editor → New query → Run
--
-- MODE TEST (sans vérifier l’e-mail à l’inscription) :
-- Dashboard → Authentication → Providers → Email
--   → désactiver « Confirm email » (Confirm user email)
-- Cela évite les e-mails de confirmation et réduit les erreurs 429 liées au mail.
-- Tu pourras réactiver la confirmation plus tard en production.

-- Table profil (une ligne par compte Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Profil Oldify ; rempli automatiquement à la création du compte Auth.';

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politiques (test : lecture publique des profils ; à resserrer en prod si besoin)
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Droits API (clé anon / authenticated)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- À chaque nouveau user Auth → une ligne dans public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(TRIM(NEW.raw_user_meta_data ->> 'full_name'), '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_new_user();

-- Comptes déjà existants avant ce script : copier dans profiles
INSERT INTO public.profiles (id, email, full_name)
SELECT
  u.id,
  u.email,
  NULLIF(TRIM(u.raw_user_meta_data ->> 'full_name'), '')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id)
ON CONFLICT (id) DO NOTHING;
