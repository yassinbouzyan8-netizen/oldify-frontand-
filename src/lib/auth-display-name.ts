import type { AppUser } from "@/lib/auth-app-user";

export function displayNameFromUser(user: AppUser | null): string {
  if (!user) return "Mon compte";
  if (user.full_name?.trim()) return user.full_name.trim();
  if (user.email) {
    const local = user.email.split("@")[0]?.trim();
    if (local) return local;
    return user.email;
  }
  return "Mon compte";
}

export function handleFromUser(user: AppUser | null): string {
  const name = displayNameFromUser(user);
  const slug = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  const safe = slug || "user";
  return `@${safe}_oldify`;
}
