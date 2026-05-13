/** Ligne utilisateur exposée par `GET /api/admin/users` (sans mot de passe). */
export type AdminUserPublic = {
  id: string;
  email: string;
  full_name: string | null;
  role: "user" | "admin";
  created_at: string | null;
};
