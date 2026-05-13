"use client";

import { useCallback, useEffect, useState } from "react";
import type { AdminUserPublic } from "@/lib/admin-user-types";

type UsersApiOk = {
  page: number;
  perPage: number;
  totalCount: number | null;
  totalPages: number | null;
  users: AdminUserPublic[];
  fromPython?: unknown;
  pythonError?: string | null;
};

function summaryFromPython(fromPython: unknown): string | null {
  if (!fromPython || typeof fromPython !== "object") return null;
  const s = (fromPython as { summary_fr?: unknown }).summary_fr;
  return typeof s === "string" && s.trim() ? s.trim() : null;
}

export function AdminUsersTable() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<UsersApiOk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users?page=${p}`, {
        credentials: "include",
      });
      const json = (await res.json()) as UsersApiOk & { error?: string };
      if (!res.ok) {
        setData(null);
        setError(json.error ?? `Erreur ${res.status}`);
        return;
      }
      setData(json);
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(page);
  }, [page, load]);

  const summary = data ? summaryFromPython(data.fromPython) : null;
  const totalPages = data?.totalPages;
  const canPrev = page > 1;
  const canNext =
    totalPages !== null && totalPages !== undefined
      ? page < totalPages
      : (data?.users.length ?? 0) >= (data?.perPage ?? 20);

  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Utilisateurs</h2>
          <p className="text-sm text-slate-600">
            20 comptes par page — données Supabase, traitées par{" "}
            <code className="rounded bg-slate-100 px-1 text-xs">
              python/admin_users_page.py
            </code>
            .
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!canPrev || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Précédent
          </button>
          <span className="min-w-[5rem] text-center text-sm tabular-nums text-slate-600">
            {loading ? "…" : `Page ${page}${totalPages ? ` / ${totalPages}` : ""}`}
          </span>
          <button
            type="button"
            disabled={!canNext || loading}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      </div>

      {summary ? (
        <p className="mt-4 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-sm text-teal-900">
          {summary}
        </p>
      ) : null}
      {data?.pythonError ? (
        <p className="mt-2 text-xs text-amber-700" role="status">
          Python : {data.pythonError} (le tableau affiche quand même les données
          serveur.)
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-100">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Nom</th>
              <th className="px-3 py-2">Rôle</th>
              <th className="px-3 py-2">Créé le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-slate-800">
            {loading && !data ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                  Chargement…
                </td>
              </tr>
            ) : data?.users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                  Aucun utilisateur.
                </td>
              </tr>
            ) : (
              data?.users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="max-w-[200px] truncate px-3 py-2 font-mono text-xs">
                    {u.email}
                  </td>
                  <td className="max-w-[160px] truncate px-3 py-2">
                    {u.full_name ?? "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={
                        u.role === "admin"
                          ? "rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900"
                          : "rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                      }
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-600">
                    {u.created_at
                      ? new Date(u.created_at).toLocaleString("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
