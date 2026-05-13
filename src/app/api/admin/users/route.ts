import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { isAdminUser, normalizeUserRole } from "@/lib/auth-role";
import {
  parsePythonJsonStdout,
  runPythonScriptFromRepo,
} from "@/lib/admin-python-run";
import {
  supabaseAdminExactCount,
  supabaseAdminRest,
} from "@/lib/supabase-admin-rest";
import type { AdminUserPublic } from "@/lib/admin-user-types";

export const runtime = "nodejs";

const PER_PAGE = 20;

type DbUser = {
  id: string;
  email: string;
  full_name: string | null;
  role?: string | null;
  created_at: string;
};

async function fetchUsersFromDb(
  offset: number,
  limit: number,
): Promise<AdminUserPublic[]> {
  const base = `order=created_at.desc&offset=${offset}&limit=${limit}`;
  const withRole = `/app_users?select=id,email,full_name,role,created_at&${base}`;
  const noRole = `/app_users?select=id,email,full_name,created_at&${base}`;

  let r = await supabaseAdminRest<DbUser[]>(withRole, { method: "GET" });
  if (r.status < 400 && Array.isArray(r.data)) {
    return r.data.map((row) => ({
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      role: normalizeUserRole(row.role),
      created_at: row.created_at ?? null,
    }));
  }

  r = await supabaseAdminRest<DbUser[]>(noRole, { method: "GET" });
  if (r.status < 400 && Array.isArray(r.data)) {
    return r.data.map((row) => ({
      id: row.id,
      email: row.email,
      full_name: row.full_name,
      role: "user" as const,
      created_at: row.created_at ?? null,
    }));
  }
  return [];
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isAdminUser(user)) {
    return NextResponse.json({ error: "Accès admin requis." }, { status: 403 });
  }

  const url = new URL(request.url);
  const rawPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;
  const offset = (page - 1) * PER_PAGE;

  let totalCount: number | null = null;
  try {
    totalCount = await supabaseAdminExactCount("/app_users?select=id");
  } catch {
    totalCount = null;
  }

  const users = await fetchUsersFromDb(offset, PER_PAGE);
  const totalPages =
    totalCount !== null ? Math.max(1, Math.ceil(totalCount / PER_PAGE)) : null;

  const stdinPayload = {
    users,
    page,
    perPage: PER_PAGE,
    totalCount,
    totalPages,
  };

  let fromPython: unknown = null;
  let pythonError: string | null = null;
  try {
    const py = await runPythonScriptFromRepo(
      "python/admin_users_page.py",
      JSON.stringify(stdinPayload),
    );
    if (py.ok) {
      try {
        fromPython = parsePythonJsonStdout(py.stdout);
      } catch {
        pythonError = "Réponse Python invalide (JSON).";
      }
    } else {
      pythonError =
        py.stderr?.trim() ||
        "Python indisponible (installe Python 3 ou vérifie le PATH).";
    }
  } catch {
    pythonError = "Erreur lors de l’exécution Python.";
  }

  const pyUsers =
    fromPython &&
    typeof fromPython === "object" &&
    fromPython !== null &&
    "users" in fromPython &&
    Array.isArray((fromPython as { users: unknown }).users)
      ? ((fromPython as { users: AdminUserPublic[] }).users)
      : null;

  const displayUsers = pyUsers && pyUsers.length > 0 ? pyUsers : users;

  return NextResponse.json({
    page,
    perPage: PER_PAGE,
    totalCount,
    totalPages,
    users: displayUsers,
    fromPython,
    pythonError,
  });
}
