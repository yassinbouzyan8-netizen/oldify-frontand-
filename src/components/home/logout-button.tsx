"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("oldify-auth-change"));
          }
          router.push("/login");
          router.refresh();
        } finally {
          setLoading(false);
        }
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
