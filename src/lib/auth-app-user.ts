/** Utilisateur renvoyé par `GET /api/auth/me` (ton backend). */
export type AppUser = {
  id: string;
  email: string;
  full_name: string | null;
};
