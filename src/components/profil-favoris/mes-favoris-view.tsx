"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getFavoriteProducts } from "@/data/mes-favoris";
import type { Product } from "@/data/products";

export function MesFavorisView() {
  const initial = useMemo(() => getFavoriteProducts(), []);
  const [items, setItems] = useState<Product[]>(initial);

  function removeFavorite(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex-1 bg-white px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Favoris</h1>
      <p className="mt-1 text-sm text-gray-500">
        Articles que vous avez sauvegardés
      </p>

      {items.length === 0 ? (
        <div className="mx-auto mt-16 max-w-md rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-6 py-12 text-center">
          <HeartOutline className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 font-medium text-gray-900">Aucun favori pour le moment</p>
          <p className="mt-2 text-sm text-gray-600">
            Parcourez les annonces et touchez le cœur pour les retrouver ici.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Explorer les articles
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {items.map((item) => (
            <li key={item.id}>
              <article className="group relative">
                <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                  <Link href={`/annonce/${item.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">Voir {item.title}</span>
                  </Link>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <button
                    type="button"
                    onClick={() => removeFavorite(item.id)}
                    className="absolute right-2 top-2 z-20 rounded-full bg-white/95 p-2 text-teal-600 shadow-md transition-colors hover:bg-white hover:text-red-500"
                    aria-label={`Retirer ${item.title} des favoris`}
                  >
                    <HeartFilled className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3">
                  <Link
                    href={`/annonce/${item.id}`}
                    className="text-sm font-medium text-gray-900 hover:text-teal-700 sm:text-base"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {item.price} DH
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HeartFilled({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function HeartOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}
