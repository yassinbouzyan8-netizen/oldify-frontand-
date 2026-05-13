import type { AppUser } from "@/lib/auth-app-user";
import { normalizeUserRole } from "@/lib/auth-role";

/** Extrait un JWT / token depuis des réponses API typiques (Nest, etc.). */
export function extractAccessToken(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  const direct = o.accessToken ?? o.access_token ?? o.token ?? o.jwt;
  if (typeof direct === "string" && direct.length > 0) return direct;
  const data = o.data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const inner =
      d.accessToken ?? d.access_token ?? d.token ?? d.jwt ?? d.accessToken;
    if (typeof inner === "string" && inner.length > 0) return inner;
  }
  return null;
}

export function messageFromUpstream(json: unknown): string {
  if (!json || typeof json !== "object") return "";
  const o = json as Record<string, unknown>;
  const m = o.message ?? o.error;
  if (typeof m === "string") return m;
  if (Array.isArray(m) && typeof m[0] === "string") return m[0];
  if (m && typeof m === "object" && "message" in m) {
    const inner = (m as { message?: string }).message;
    if (typeof inner === "string") return inner;
  }
  return "";
}

/** Interprète le JSON `/auth/me` de ton API en `AppUser`. */
export function parseAppUser(json: unknown): AppUser | null {
  if (!json || typeof json !== "object") return null;
  const o = json as Record<string, unknown>;
  const raw =
    (o.user && typeof o.user === "object" ? o.user : null) ??
    (o.data && typeof o.data === "object" ? o.data : null) ??
    o;
  if (!raw || typeof raw !== "object") return null;
  const u = raw as Record<string, unknown>;
  const id = String(u.id ?? u.sub ?? "").trim();
  const email = String(u.email ?? "").trim();
  const fn = u.full_name ?? u.fullName ?? u.name;
  const full_name =
    typeof fn === "string" && fn.trim() ? fn.trim() : null;
  const roleRaw = u.role ?? u.userRole;
  const role = normalizeUserRole(
    typeof roleRaw === "string" ? roleRaw : undefined,
  );
  if (!id && !email) return null;
  return {
    id: id || email,
    email: email || id,
    full_name,
    role,
  };
}
