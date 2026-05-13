"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { AppUser } from "@/lib/auth-app-user";
import { mapAuthError } from "@/lib/auth-errors";
import { isAdminUser } from "@/lib/auth-role";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submitting = useRef(false);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Bienvenue sur Oldify
        </h1>
        <p className="text-base text-gray-500">
          Connectez-vous à votre compte
        </p>
      </div>

      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          if (submitting.current) return;
          setError(null);
          submitting.current = true;
          setLoading(true);
          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: email.trim(),
                password,
              }),
            });
            const data = (await res.json()) as {
              error?: string;
              user?: AppUser;
            };
            if (!res.ok) {
              setError(mapAuthError(data.error || res.statusText));
              return;
            }
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("oldify-auth-change"));
            }
            let dest = "/";
            if (isAdminUser(data.user)) {
              dest = "/admin";
            } else if (!data.user) {
              await new Promise((r) => setTimeout(r, 80));
              const meRes = await fetch("/api/auth/me", {
                credentials: "include",
              });
              const me = (await meRes.json()) as { user?: AppUser | null };
              if (isAdminUser(me.user)) dest = "/admin";
            }
            router.push(dest);
            router.refresh();
          } finally {
            setLoading(false);
            submitting.current = false;
          }
        }}
      >
        {error ? (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@exemple.com"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-4 pr-12 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label={
                showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"
              }
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/mot-de-passe-oublie"
            className="text-sm text-gray-500 underline-offset-4 hover:text-teal-700 hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-teal-600 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="font-medium text-teal-600 underline-offset-4 hover:text-teal-700 hover:underline"
        >
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}
