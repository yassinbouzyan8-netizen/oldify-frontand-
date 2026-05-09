"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  className?: string;
};

/** Nettoie l’ancienne démo cookie/localStorage si présents. */
function clearLegacyDemoAuth() {
  if (typeof document === "undefined") return;
  document.cookie = "oldify_session=; path=/; max-age=0";
  try {
    window.localStorage.removeItem("oldify_logged_in");
  } catch {
    /* ignore */
  }
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        clearLegacyDemoAuth();
        const supabase = createClient();
        await supabase.auth.signOut();
        setLoading(false);
        router.push("/login");
        router.refresh();
      }}
      className={
        className ??
        "inline-flex shrink-0 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-700 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800 disabled:opacity-60 sm:px-3 sm:text-sm"
      }
    >
      {loading ? "…" : "Déconnexion"}
    </button>
  );
}
