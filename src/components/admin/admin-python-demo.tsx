"use client";

import { useCallback, useEffect, useState } from "react";

type ApiOk = {
  sourceCounts: { userCount: number | null; annonceCount: number | null };
  fromPython: {
    summary_fr?: string;
    message?: string;
    input?: { userCount?: number | null; annonceCount?: number | null };
  };
};

export function AdminPythonDemo() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setText(null);
    setSummary(null);
    try {
      const res = await fetch("/api/admin/python-demo", { credentials: "include" });
      const body = await res.text();
      setText(`${res.status} — ${body}`);
      if (res.ok) {
        try {
          const json = JSON.parse(body) as ApiOk;
          if (json.fromPython?.summary_fr) {
            setSummary(json.fromPython.summary_fr);
          }
        } catch {
          /* corps non JSON */
        }
      }
    } catch (e) {
      setText(e instanceof Error ? e.message : "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void run();
  }, [run]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Python + comptes</h2>
      <p className="mt-2 text-sm text-slate-600">
        Next.js lit le nombre d’utilisateurs et d’annonces (Supabase), envoie ce JSON au
        script{" "}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">
          python/admin_hello.py
        </code>{" "}
        via stdin ; Python renvoie un résumé (
        <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">summary_fr</code>
        ).
      </p>
      {summary ? (
        <p className="mt-4 rounded-xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900">
          {summary}
        </p>
      ) : loading ? (
        <p className="mt-4 text-sm text-slate-500">Chargement du résumé Python…</p>
      ) : null}
      <button
        type="button"
        onClick={() => void run()}
        disabled={loading}
        className="mt-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Exécution…" : "Rafraîchir"}
      </button>
      {text ? (
        <pre className="mt-4 max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100 whitespace-pre-wrap wrap-break-word">
          {text}
        </pre>
      ) : null}
      <p className="mt-3 text-xs text-slate-500">
        Sur Vercel / serverless sans Python installé, l’API renverra souvent 502 ; les
        comptes restent visibles sur les cartes au-dessus. Pour la prod, un petit
        service Python en HTTP est une alternative fiable.
      </p>
    </div>
  );
}
