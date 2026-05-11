"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  type ListingStatus,
  type UserListing,
} from "@/data/mes-annonces";

const TABS: { id: ListingStatus; label: string }[] = [
  { id: "en-ligne", label: "En ligne" },
  { id: "en-attente", label: "En attente" },
  { id: "vendue", label: "Vendues" },
];

export function MesAnnoncesView() {
  const [tab, setTab] = useState<ListingStatus>("en-ligne");
  const [items, setItems] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/annonces?mine=1", { credentials: "include" });
        const data = (await res.json()) as {
          annonces?: Array<{
            id: string;
            title: string;
            price: number;
            images?: string[];
            status?: string;
          }>;
          error?: string;
        };
        if (!res.ok) {
          throw new Error(data.error || "Impossible de charger les annonces.");
        }
        const mapped: UserListing[] = (data.annonces ?? []).map((a) => ({
          id: a.id,
          title: a.title,
          price: Number(a.price) || 0,
          image: a.images?.[0] || "/imges/produit/Sacmain.png",
          status: (a.status as ListingStatus) || "en-ligne",
          views: 0,
          likes: 0,
        }));
        if (!cancelled) setItems(mapped);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Erreur.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => items.filter((l) => l.status === tab),
    [items, tab],
  );

  const counts = useMemo(() => {
    return {
      "en-ligne": items.filter((i) => i.status === "en-ligne").length,
      "en-attente": items.filter((i) => i.status === "en-attente").length,
      vendue: items.filter((i) => i.status === "vendue").length,
    } as const;
  }, [items]);

  return (
    <div className="flex-1 bg-white px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Mes annonces</h1>

      <div className="mt-6 flex gap-6 border-b border-gray-200">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                active
                  ? "text-teal-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}{" "}
              <span className={active ? "text-teal-600" : "text-gray-400"}>
                ({counts[t.id]})
              </span>
              {active ? (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-teal-600" />
              ) : null}
            </button>
          );
        })}
      </div>

      {error ? (
        <p
          className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="mt-6 text-sm text-gray-500">Chargement…</p>
      ) : null}

      <ul className="mt-6 divide-y divide-gray-100">
        {filtered.map((item) => (
          <ListingRow key={item.id} item={item} />
        ))}
      </ul>

      {!loading && filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500">
          Aucune annonce dans cet onglet.
        </p>
      ) : null}
    </div>
  );
}

function ListingRow({ item }: { item: UserListing }) {
  return (
    <li className="flex flex-wrap items-center gap-4 py-4 sm:flex-nowrap sm:gap-6">
      <Link
        href={`/annonce/${item.id}`}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-20"
      >
        <Image
          src={item.image}
          alt=""
          fill
          className="object-cover"
          sizes="80px"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={`/annonce/${item.id}`}
          className="font-medium text-gray-900 hover:text-teal-700"
        >
          {item.title}
        </Link>
        <p className="mt-0.5 text-sm font-semibold text-gray-800">
          {item.price} DH
        </p>
      </div>

      <StatusBadge status={item.status} />

      <div className="flex items-center gap-4 text-sm text-gray-500 sm:gap-6">
        <span className="flex items-center gap-1" title="Vues">
          <EyeIcon className="h-4 w-4" />
          {item.views}
        </span>
        <span className="flex items-center gap-1" title="J&apos;aime">
          <HeartIcon className="h-4 w-4" />
          {item.likes}
        </span>
      </div>

      <button
        type="button"
        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
        aria-label="Plus d&apos;options"
      >
        <DotsIcon className="h-5 w-5" />
      </button>
    </li>
  );
}

function StatusBadge({ status }: { status: ListingStatus }) {
  const styles = {
    "en-ligne": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "en-attente": "bg-amber-50 text-amber-800 ring-amber-600/20",
    vendue: "bg-red-50 text-red-700 ring-red-600/20",
  } as const;

  const labels = {
    "en-ligne": "En ligne",
    "en-attente": "En attente",
    vendue: "Vendue",
  } as const;

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm5.25 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}
