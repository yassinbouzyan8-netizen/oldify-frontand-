import type { Metadata } from "next";
import Link from "next/link";
import { AdminPythonDemo } from "@/components/admin/admin-python-demo";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { displayNameFromUser } from "@/lib/auth-display-name";
import { getCurrentUser } from "@/lib/auth-server";
import {
  supabaseAdminExactCount,
} from "@/lib/supabase-admin-rest";

export const metadata: Metadata = {
  title: "Administration",
};

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-900">
        {value}
      </p>
      {hint ? (
        <p className="mt-2 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  let userCount: number | null = null;
  let annonceCount: number | null = null;
  try {
    [userCount, annonceCount] = await Promise.all([
      supabaseAdminExactCount("/app_users?select=id"),
      supabaseAdminExactCount("/annonces?select=id"),
    ]);
  } catch {
    /* env Supabase admin manquant ou erreur réseau */
  }

  const formatCount = (n: number | null) =>
    n === null ? "—" : new Intl.NumberFormat("fr-FR").format(n);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Tableau de bord
        </h1>
        <p className="mt-1 text-slate-600">
          Connecté en tant que{" "}
          <span className="font-medium text-slate-900">
            {user ? displayNameFromUser(user) : "admin"}
          </span>{" "}
          ({user?.email})
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          title="Comptes utilisateurs"
          value={formatCount(userCount)}
          hint="Lecture service role (agrégat)."
        />
        <StatCard
          title="Annonces"
          value={formatCount(annonceCount)}
          hint="Toutes les annonces en base."
        />
      </div>

      <AdminUsersTable />

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Raccourcis</h2>
        <ul className="mt-4 flex flex-col gap-2 text-sm text-teal-700">
          <li>
            <Link href="/" className="font-medium underline-offset-2 hover:underline">
              Voir le site public
            </Link>
          </li>
          <li>
            <Link
              href="/vendre"
              className="font-medium underline-offset-2 hover:underline"
            >
              Publier une annonce (test)
            </Link>
          </li>
        </ul>
        <p className="mt-6 text-xs text-slate-500">
          Tu peux étendre cette page avec des listes (utilisateurs, annonces en
          modération), exports, ou d’autres routes{" "}
          <code className="rounded bg-slate-100 px-1">/api/admin/…</code>.
        </p>
      </section>

      <div className="mt-10">
        <AdminPythonDemo />
      </div>
    </main>
  );
}
