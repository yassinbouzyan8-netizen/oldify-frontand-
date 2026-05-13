import type { AppUser } from "@/lib/auth-app-user";
import { normalizeUserRole } from "@/lib/auth-role";
import { supabaseAdminRest } from "@/lib/supabase-admin-rest";

export type LocalLoginRow = {
  id: string;
  email: string;
  password_hash: string;
  full_name: string | null;
  role: string | null;
};

function rowToAppUser(
  row: Omit<LocalLoginRow, "password_hash">,
): AppUser {
  return {
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: normalizeUserRole(row.role),
  };
}

/** Connexion locale : lecture `app_users` avec repli si la colonne `role` n’existe pas encore. */
export async function getLocalLoginRowByEmail(
  normEmail: string,
): Promise<LocalLoginRow | null> {
  const withRole = await supabaseAdminRest<
    Array<{
      id: string;
      email: string;
      password_hash: string;
      full_name: string | null;
      role: string | null;
    }>
  >(
    `/app_users?select=id,email,password_hash,full_name,role&email=eq.${encodeURIComponent(normEmail)}&limit=1`,
    { method: "GET" },
  );
  if (
    withRole.status < 400 &&
    Array.isArray(withRole.data) &&
    withRole.data[0]
  ) {
    return withRole.data[0];
  }

  const noRole = await supabaseAdminRest<
    Array<{
      id: string;
      email: string;
      password_hash: string;
      full_name: string | null;
    }>
  >(
    `/app_users?select=id,email,password_hash,full_name&email=eq.${encodeURIComponent(normEmail)}&limit=1`,
    { method: "GET" },
  );
  if (noRole.status < 400 && Array.isArray(noRole.data) && noRole.data[0]) {
    return { ...noRole.data[0], role: null };
  }
  return null;
}

export function appUserFromLoginRow(row: LocalLoginRow): AppUser {
  return rowToAppUser({
    id: row.id,
    email: row.email,
    full_name: row.full_name,
    role: row.role,
  });
}

/** Session locale : même repli `role` pour `/api/auth/me` et layouts. */
export async function getLocalAppUserById(
  subjectId: string,
): Promise<AppUser | null> {
  const id = encodeURIComponent(subjectId);
  const withRole = await supabaseAdminRest<
    Array<{
      id: string;
      email: string;
      full_name: string | null;
      role: string | null;
    }>
  >(`/app_users?select=id,email,full_name,role&id=eq.${id}&limit=1`, {
    method: "GET",
  });
  if (
    withRole.status < 400 &&
    Array.isArray(withRole.data) &&
    withRole.data[0]
  ) {
    const row = withRole.data[0];
    return rowToAppUser(row);
  }

  const noRole = await supabaseAdminRest<
    Array<{ id: string; email: string; full_name: string | null }>
  >(`/app_users?select=id,email,full_name&id=eq.${id}&limit=1`, {
    method: "GET",
  });
  if (noRole.status < 400 && Array.isArray(noRole.data) && noRole.data[0]) {
    const row = noRole.data[0];
    return rowToAppUser({ ...row, role: null });
  }
  return null;
}
