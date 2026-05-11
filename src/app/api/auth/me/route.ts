import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  authMePath,
  getAuthApiBaseUrl,
  usesExternalAuthApi,
} from "@/lib/auth-backend-config";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import { parseAppUser } from "@/lib/auth-upstream";
import { verifySessionToken } from "@/lib/local-auth/crypto";
import type { AppUser } from "@/lib/auth-app-user";
import { supabaseAdminRest } from "@/lib/supabase-admin-rest";

export const runtime = "nodejs";

export async function GET() {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  if (!usesExternalAuthApi()) {
    const payload = verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ user: null });
    }
    const found = await supabaseAdminRest<
      Array<{ id: string; email: string; full_name: string | null }>
    >(
      `/app_users?select=id,email,full_name&id=eq.${encodeURIComponent(payload.sub)}&limit=1`,
      { method: "GET" },
    );
    const row = Array.isArray(found.data) ? found.data[0] : null;
    if (!row) {
      return NextResponse.json({ user: null });
    }
    const user: AppUser = {
      id: row.id,
      email: row.email,
      full_name: row.full_name,
    };
    return NextResponse.json({ user });
  }

  let base: string;
  try {
    base = getAuthApiBaseUrl();
  } catch {
    return NextResponse.json({ user: null });
  }

  const path = authMePath();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ user: null });
  }

  if (!upstream.ok) {
    return NextResponse.json({ user: null });
  }

  const text = await upstream.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    return NextResponse.json({ user: null });
  }

  const user = parseAppUser(json);
  return NextResponse.json({ user });
}
