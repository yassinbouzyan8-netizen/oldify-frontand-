"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PURCHASES,
  purchaseCount,
  type Purchase,
  type PurchaseTab,
} from "@/data/mes-achats";

const TABS: { id: PurchaseTab; label: string }[] = [
  { id: "en-cours", label: "En cours" },
  { id: "termines", label: "Terminés" },
  { id: "annules", label: "Annulés" },
];

export function MesAchatsView() {
  const [tab, setTab] = useState<PurchaseTab>("en-cours");

  const filtered = useMemo(
    () => PURCHASES.filter((p) => p.status === tab),
    [tab],
  );

  return (
    <div className="flex-1 bg-white px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Mes achats</h1>

      <div className="mt-6 flex flex-wrap gap-6 border-b border-gray-200">
        {TABS.map((t) => {
          const active = tab === t.id;
          const count = purchaseCount(t.id);
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
                ({count})
              </span>
              {active ? (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-teal-600" />
              ) : null}
            </button>
          );
        })}
      </div>

      <ul className="mt-6 space-y-3">
        {filtered.map((item) => (
          <PurchaseRow key={item.id} item={item} />
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500">
          Aucun achat dans cet onglet.
        </p>
      ) : null}
    </div>
  );
}

function PurchaseRow({ item }: { item: Purchase }) {
  const badgeLabel =
    item.status === "en-cours"
      ? "En cours"
      : item.status === "termines"
        ? "Terminés"
        : "Annulé";

  const badgeClass =
    item.status === "en-cours"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
      : item.status === "termines"
        ? "bg-slate-100 text-slate-700 ring-slate-500/20"
        : "bg-red-50 text-red-700 ring-red-600/20";

  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-nowrap sm:gap-6">
      <Link
        href={`/annonce/${item.annonceId}`}
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
          href={`/annonce/${item.annonceId}`}
          className="font-medium text-gray-900 hover:text-teal-700"
        >
          {item.title}
        </Link>
        <p className="mt-0.5 text-sm font-semibold text-gray-800">
          {item.price} DH
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Vendeur : <span className="text-gray-700">{item.seller}</span>
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badgeClass}`}
      >
        {badgeLabel}
      </span>

      <Link
        href={`/annonce/${item.annonceId}`}
        className="shrink-0 rounded-xl border-2 border-teal-600 bg-white px-5 py-2 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50"
      >
        Voir
      </Link>
    </li>
  );
}
