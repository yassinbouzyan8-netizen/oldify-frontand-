import type { AppUser } from "@/lib/auth-app-user";

export function normalizeUserRole(
  raw: string | null | undefined,
): AppUser["role"] {
  return raw === "admin" ? "admin" : "user";
}

export function isAdminUser(user: AppUser | null | undefined): boolean {
  return user?.role === "admin";
}
