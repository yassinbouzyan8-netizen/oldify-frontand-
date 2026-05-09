"use client";

import Link from "next/link";
import { UserAvatarIcon } from "@/components/icons/user-avatar-icon";
import { displayNameFromUser } from "@/lib/auth-display-name";
import { useAuthUser } from "@/lib/use-auth-user";

export function HeaderProfileLink() {
  const { user, loading: authLoading } = useAuthUser();
  const label = user
    ? displayNameFromUser(user)
    : authLoading
      ? ""
      : "Mon compte";
  const ariaLabel =
    user && label !== "Mon compte" ? `Profil ${label}` : "Mon profil";

  return (
    <Link
      href="/profil"
      className="flex items-center gap-2 rounded-lg pl-1 transition-colors hover:bg-gray-50"
      aria-label={ariaLabel}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 ring-2 ring-white">
        <UserAvatarIcon className="h-5 w-5" />
      </span>
      <span
        className="hidden max-w-44 truncate text-sm font-semibold tracking-wide text-gray-900 lg:inline"
        title={label || undefined}
      >
        {label || "\u00A0"}
      </span>
    </Link>
  );
}
