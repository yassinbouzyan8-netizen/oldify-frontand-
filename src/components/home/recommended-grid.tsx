"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CatalogFilterId } from "@/data/products";
import { PRODUCTS } from "@/data/products";

type RecommendedGridProps = {
  activeCategory: CatalogFilterId;
};

export function RecommendedGrid({ activeCategory }: RecommendedGridProps) {
  const [dbItems, setDbItems] = useState<
    Array<{
      id: string;
      title: string;
      price: number;
      category?: string;
      images?: string[];
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/annonces", { credentials: "include" });
        const json = (await res.json()) as {
          annonces?: Array<{
            id: string;
            title: string;
            price: number;
            category?: string;
            images?: string[];
          }>;
        };
        if (!cancelled) setDbItems(json.annonces ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedDb = useMemo(() => {
    const mapCategory = (c?: string): Exclude<CatalogFilterId, "all"> | null => {
      const v = (c ?? "").toLowerCase();
      if (v.includes("femme")) return "women";
      if (v.includes("homme")) return "men";
      if (v.includes("électron") || v.includes("electron")) return "electronics";
      if (v.includes("maison")) return "home";
      if (v.includes("livre")) return "books";
      if (v.includes("sport")) return "sports";
      if (v.includes("enfant")) return "kids";
      if (v.includes("autre")) return "other";
      return null;
    };

    return dbItems
      .map((a) => ({
        id: a.id,
        title: a.title,
        price: Number(a.price) || 0,
        image: a.images?.[0] || "/imges/produit/Sacmain.png",
        category: mapCategory(a.category) ?? "other",
        source: "db" as const,
      }))
      .filter((x) => x.title);
  }, [dbItems]);

  const list = useMemo(() => {
    const staticList =
      activeCategory === "all"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === activeCategory);

    const dbList =
      activeCategory === "all"
        ? normalizedDb
        : normalizedDb.filter((p) => p.category === activeCategory);

    // DB d'abord (vraies annonces), puis fallback statique
    return [
      ...dbList.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
      })),
      ...staticList.map((p) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
      })),
    ];
  }, [activeCategory, normalizedDb]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">
        Recommandé pour vous
      </h2>

      {!loading && list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-12 text-center text-sm text-gray-600">
          Aucun article dans cette catégorie pour le moment.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {list.map((item, index) => (
            <li key={item.id}>
              <article className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index === 0}
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <Link
                    href={`/annonce/${item.id}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Voir ${item.title}`}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="absolute right-2 top-2 z-20 rounded-full bg-white/90 p-1.5 text-gray-400 shadow-sm transition-colors hover:bg-white hover:text-teal-600"
                    aria-label={`Ajouter ${item.title} aux favoris`}
                  >
                    <HeartOutline className="h-5 w-5" />
                  </button>
                </div>
                <Link href={`/annonce/${item.id}`} className="mt-3 block">
                  <h3 className="text-sm font-medium text-gray-900 sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {item.price} DH
                  </p>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function HeartOutline({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>
  );
}
