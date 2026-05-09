/**
 * Contrat attendu avec ton API (à adapter sur ton backend si besoin) :
 *
 * - `POST {base}{OLDIFY_AUTH_LOGIN_PATH||/auth/login}` body `{ email, password }`
 *   → JSON avec **un** des champs : `accessToken` | `access_token` | `token` | `jwt`
 *
 * - `POST {base}{OLDIFY_AUTH_REGISTER_PATH||/auth/register}` body `{ email, password, fullName?, full_name? }`
 *   → idem token si connexion auto, sinon le front appellera `/api/auth/login` juste après.
 *
 * - `GET {base}{OLDIFY_AUTH_ME_PATH||/auth/me}` header `Authorization: Bearer <token>`
 *   → JSON utilisateur : racine ou `{ user }` ou `{ data }`, avec `id`, `email`, `full_name` ou `fullName`.
 *
 * URL de base : **serveur uniquement** (pas NEXT_PUBLIC_). Ex. `http://localhost:3001`
 */
export function getAuthApiBaseUrl(): string {
  const base = process.env.OLDIFY_API_BASE_URL?.trim();
  if (!base) {
    throw new Error("OLDIFY_API_BASE_URL manquant dans .env");
  }
  return base.replace(/\/$/, "");
}

export function authLoginPath(): string {
  return (process.env.OLDIFY_AUTH_LOGIN_PATH ?? "/auth/login").trim() || "/auth/login";
}

export function authRegisterPath(): string {
  return (process.env.OLDIFY_AUTH_REGISTER_PATH ?? "/auth/register").trim() ||
    "/auth/register";
}

export function authMePath(): string {
  return (process.env.OLDIFY_AUTH_ME_PATH ?? "/auth/me").trim() || "/auth/me";
}
