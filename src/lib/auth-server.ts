import { cookies } from "next/headers";
import type { AppUser } from "@/lib/auth-app-user";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";
import {
  authMePath,
  getAuthApiBaseUrl,
  usesExternalAuthApi,
} from "@/lib/auth-backend-config";
import { getLocalAppUserById } from "@/lib/auth-local-db-user";
import { parseAppUser } from "@/lib/auth-upstream";
import { verifySessionToken } from "@/lib/local-auth/crypto";

export async function getCurrentUser(): Promise<AppUser | null> {
  const jar = await cookies();
  const token = jar.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;

  if (!usesExternalAuthApi()) {
    const payload = verifySessionToken(token);
    if (!payload) return null;
    return getLocalAppUserById(payload.sub);
  }

  let base: string;
  try {
    base = getAuthApiBaseUrl();
  } catch {
    return null;
  }

  const path = authMePath();
  const url = `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const text = await res.text();
    const json = text ? (JSON.parse(text) as unknown) : null;
    return parseAppUser(json);
  } catch {
    return null;
  }
}

