/**
 * Mode **externe** : `OLDIFY_API_BASE_URL` défini → les routes `/api/auth/*` proxifient ton Nest / API.
 *
 * Mode **local** (démo, sans backend) : la variable est absente ou vide → comptes dans `.data/oldify-users.json`
 * + cookie signé avec `AUTH_SECRET`.
 *
 * Contrat API externe (si OLDIFY défini) : voir commentaires précédents sur /auth/login, /auth/register, /auth/me.
 */
export function usesExternalAuthApi(): boolean {
  return Boolean(process.env.OLDIFY_API_BASE_URL?.trim());
}

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
