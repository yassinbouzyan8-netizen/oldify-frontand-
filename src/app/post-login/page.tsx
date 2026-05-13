"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { AppUser } from "@/lib/auth-app-user";
import { isAdminUser } from "@/lib/auth-role";

export default function PostLoginRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    const go = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = (await res.json()) as { user?: AppUser | null };
        if (cancelled) return;
        router.replace(isAdminUser(data.user) ? "/admin" : "/");
      } catch {
        if (!cancelled) router.replace("/");
      }
    };
    void go();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-600">
      <p className="text-sm">Redirection…</p>
    </div>
  );
}
