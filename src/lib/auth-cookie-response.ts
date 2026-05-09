import type { NextResponse } from "next/server";
import {
  AUTH_COOKIE_MAX_AGE_SEC,
  AUTH_COOKIE_NAME,
} from "@/lib/auth-cookie";

/**
 * `Secure` sur un cookie bloque l’envoi en **HTTP** (ex. IP sans certificat).
 * En prod derrière HTTPS : mets `AUTH_COOKIE_SECURE=true` dans .env
 * Sur HTTP (démo / IP) : laisse vide ou `false` pour que la connexion fonctionne.
 */
function cookieSecure(): boolean {
  return process.env.AUTH_COOKIE_SECURE === "true";
}

export function setTokenCookie(res: NextResponse, token: string) {
  res.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE_SEC,
  });
}

export function clearTokenCookie(res: NextResponse) {
  res.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
