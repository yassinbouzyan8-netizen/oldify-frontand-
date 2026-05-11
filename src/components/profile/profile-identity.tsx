"use client";

import type { ReactNode } from "react";
import { UserAvatarIcon } from "@/components/icons/user-avatar-icon";
import { displayNameFromUser, handleFromUser } from "@/lib/auth-display-name";
import { useAuthUser } from "@/lib/use-auth-user";

type ProfileIdentityProps = {
  /** Ex. liste stats sous le pseudo */
  children?: ReactNode;
};

export function ProfileIdentity({ children }: ProfileIdentityProps) {
  const { user, loading: authLoading } = useAuthUser();
  const name = user
    ? displayNameFromUser(user)
    : authLoading
      ? "…"
      : "Mon compte";
  const email = user?.email ?? null;
  const handle = user
    ? handleFromUser(user)
    : authLoading
      ? "…"
      : "@user_oldify";

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
      <div
        className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-teal-50 text-teal-700 ring-2 ring-gray-100"
        aria-hidden
      >
        <UserAvatarIcon className="h-12 w-12" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {name}
        </h1>
        {email ? (
          <p className="mt-1 text-sm font-medium text-gray-600">{email}</p>
        ) : null}
        <p className="mt-1 text-sm text-gray-500">{handle}</p>
        {children}
      </div>
    </div>
  );
}
