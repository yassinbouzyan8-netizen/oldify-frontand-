import { NextResponse } from "next/server";
import {
  authRegisterPath,
  getAuthApiBaseUrl,
  usesExternalAuthApi,
} from "@/lib/auth-backend-config";
import { mapAuthError } from "@/lib/auth-errors";
import { setTokenCookie } from "@/lib/auth-cookie-response";
import { hashPassword, signSessionToken } from "@/lib/local-auth/crypto";
import { supabaseAdminRest } from "@/lib/supabase-admin-rest";
import {
  extractAccessToken,
  messageFromUpstream,
} from "@/lib/auth-upstream";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
  let body: { email?: string; password?: string; fullName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const fullName =
    typeof body.fullName === "string" ? body.fullName.trim() : undefined;
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email et mot de passe requis." },
      { status: 400 },
    );
  }

  if (!usesExternalAuthApi()) {
    const norm = email.trim().toLowerCase();
    // 1) vérifier existence
    const exists = await supabaseAdminRest<Array<{ id: string }>>(
      `/app_users?select=id&email=eq.${encodeURIComponent(norm)}&limit=1`,
      { method: "GET" },
    );
    if (exists.status < 400 && Array.isArray(exists.data) && exists.data.length > 0) {
      return NextResponse.json(
        { error: mapAuthError("User already registered") },
        { status: 409 },
      );
    }

    const passwordHash = hashPassword(password);
    const payload = {
      email: norm,
      password_hash: passwordHash,
      full_name: fullName || null,
    };
    const created = await supabaseAdminRest<
      Array<{ id: string; email: string; full_name: string | null }>
    >("/app_users?select=id,email,full_name", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(payload),
    });
    if (created.status >= 400 || !Array.isArray(created.data) || !created.data[0]) {
      return NextResponse.json(
        { error: "Impossible de créer le compte (DB)." },
        { status: 500 },
      );
    }

    const row = created.data[0];
    // 2) profil table
    await supabaseAdminRest("/app_profiles", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({
        user_id: row.id,
        email: row.email,
        full_name: row.full_name,
      }),
    });

    const token = signSessionToken({ sub: row.id, email: row.email });
    const res = NextResponse.json({ ok: true, tokenSet: true });
    setTokenCookie(res, token);
    return res;
  }

  let base: string;
  try {
    base = getAuthApiBaseUrl();
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Configuration API manquante.";
    return NextResponse.json({ error: mapAuthError(msg) }, { status: 503 });
  }

  const path = authRegisterPath();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        email,
        password,
        fullName: fullName || undefined,
        full_name: fullName || undefined,
      }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    return NextResponse.json({ error: mapAuthError(msg) }, { status: 502 });
  }

  const text = await upstream.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: text.slice(0, 200) };
  }

  if (!upstream.ok) {
    const raw = messageFromUpstream(json) || upstream.statusText;
    return NextResponse.json(
      { error: mapAuthError(raw) },
      { status: upstream.status >= 400 && upstream.status < 600 ? upstream.status : 400 },
    );
  }

  const token = extractAccessToken(json);
  const res = NextResponse.json({ ok: true, tokenSet: Boolean(token) });
  if (token) {
    setTokenCookie(res, token);
  }
  return res;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur.";
    return NextResponse.json({ error: mapAuthError(msg) }, { status: 500 });
  }
}
