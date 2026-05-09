"use client";

import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ProfileRow } from "@/lib/supabase/profile-types";

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const supabase = createClient();
    void supabase
      .from("profiles")
      .select("id, email, full_name, created_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setProfile(null);
        } else {
          setProfile(data as ProfileRow);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return { profile, loading };
}
