"use client";

import type { AppUser } from "@/lib/auth-app-user";
import { useEffect, useState } from "react";

type AuthUserState = {
  user: AppUser | null;
  loading: boolean;
};

async function fetchMe(): Promise<AppUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  const data = (await res.json()) as { user?: AppUser | null };
  return data.user ?? null;
}

export function useAuthUser(): AuthUserState {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const sync = async () => {
      const u = await fetchMe();
      if (!cancelled) {
        setUser(u);
        setLoading(false);
      }
    };

    void sync();

    const onAuthChange = () => {
      void fetchMe().then((u) => {
        if (!cancelled) setUser(u);
      });
    };

    window.addEventListener("oldify-auth-change", onAuthChange);
    return () => {
      cancelled = true;
      window.removeEventListener("oldify-auth-change", onAuthChange);
    };
  }, []);

  return { user, loading };
}
