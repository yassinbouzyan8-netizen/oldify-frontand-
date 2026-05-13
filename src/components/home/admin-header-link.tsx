"use client";

import Link from "next/link";
import { useAuthUser } from "@/lib/use-auth-user";
import { isAdminUser } from "@/lib/auth-role";

export function AdminHeaderLink() {
  const { user, loading } = useAuthUser();
  if (loading || !isAdminUser(user)) return null;

  return (
    <Link
      href="/admin"
      className="hidden rounded-full border border-teal-200 bg-teal-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-teal-800 transition-colors hover:bg-teal-100 sm:inline-flex"
    >
      Admin
    </Link>
  );
}
