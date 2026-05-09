import type { User } from "@supabase/supabase-js";

/** Nom affiché : `user_metadata.full_name`, sinon partie avant @ de l’e-mail. */
export function displayNameFromUser(user: User | null): string {
  if (!user) return "Mon compte";
  const full = user.user_metadata?.full_name;
  if (typeof full === "string" && full.trim()) return full.trim();
  if (user.email) {
    const local = user.email.split("@")[0]?.trim();
    if (local) return local;
    return user.email;
  }
  return "Mon compte";
}

/** Pseudo type vitrine (démo), dérivé du nom ou de l’e-mail. */
export function handleFromUser(user: User | null): string {
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
