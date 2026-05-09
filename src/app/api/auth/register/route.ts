import { NextResponse } from "next/server";
import {
  authRegisterPath,
  getAuthApiBaseUrl,
  usesExternalAuthApi,
} from "@/lib/auth-backend-config";
import { mapAuthError } from "@/lib/auth-errors";
import { setTokenCookie } from "@/lib/auth-cookie-response";
import { signSessionToken } from "@/lib/local-auth/crypto";
import { createLocalUser } from "@/lib/local-auth/store";
import {
  extractAccessToken,
  messageFromUpstream,
} from "@/lib/auth-upstream";

export const runtime = "nodejs";

export async function POST(request: Request) {
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
    const created = createLocalUser(email, password, fullName || null);
    if (!created.ok) {
      return NextResponse.json(
        { error: mapAuthError("User already registered") },
        { status: 409 },
      );
    }
    const token = signSessionToken({
      sub: created.user.id,
      email: created.user.email,
    });
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
}
