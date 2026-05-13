import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { isAdminUser } from "@/lib/auth-role";
import {
  parsePythonJsonStdout,
  runPythonScriptFromRepo,
} from "@/lib/admin-python-run";
import { supabaseAdminExactCount } from "@/lib/supabase-admin-rest";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  if (!isAdminUser(user)) {
    return NextResponse.json({ error: "Accès admin requis." }, { status: 403 });
  }

  let userCount: number | null = null;
  let annonceCount: number | null = null;
  try {
    [userCount, annonceCount] = await Promise.all([
      supabaseAdminExactCount("/app_users?select=id"),
      supabaseAdminExactCount("/annonces?select=id"),
    ]);
  } catch {
    /* Supabase non configuré ou erreur réseau : Python reçoit null */
  }

  const stdinJson = JSON.stringify({
    userCount,
    annonceCount,
  });

  const last = await runPythonScriptFromRepo("python/admin_hello.py", stdinJson);

  if (!last?.ok) {
    return NextResponse.json(
      {
        error:
          "Impossible d’exécuter Python (installe Python 3 et vérifie le PATH ; sur Windows, `python` ou `py -3`).",
        detail: last?.stderr ?? "",
        code: last?.code ?? null,
        sourceCounts: { userCount, annonceCount },
      },
      { status: 502 },
    );
  }

  try {
    const fromPython = parsePythonJsonStdout(last.stdout);
    return NextResponse.json({
      sourceCounts: { userCount, annonceCount },
      fromPython,
    });
  } catch {
    return NextResponse.json(
      {
        error: "Réponse Python non JSON.",
        raw: last.stdout,
        sourceCounts: { userCount, annonceCount },
      },
      { status: 502 },
    );
  }
}
