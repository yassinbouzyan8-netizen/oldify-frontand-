"use client";

import Image from "next/image";
import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabasePublicStorageUrl } from "@/lib/image-src";

const CATEGORIES = [
  "Femmes",
  "Hommes",
  "Électronique",
  "Maison",
  "Livres",
  "Sports",
  "Enfants",
  "Autres",
] as const;

const CONDITIONS = ["Très bon état", "Bon état", "État correct", "Neuf"] as const;

const CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Autre",
] as const;

export function PublierAnnonceForm() {
  const fileId = useId();
  const router = useRouter();
  const [delivery, setDelivery] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Femmes");
  const [condition, setCondition] = useState<(typeof CONDITIONS)[number]>(
    "Très bon état",
  );
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(150);
  const [city, setCity] = useState<(typeof CITIES)[number]>("Casablanca");

  const photosHelp = useMemo(() => {
    if (!fileName) return "Choisis 1 à 8 photos (PNG/JPG).";
    return `${fileName}`;
  }, [fileName]);

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-white">
      <header className="flex items-center justify-between border-b border-gray-100 px-6 py-4 lg:px-10">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Publier une annonce
        </h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Rechercher"
          >
            <SearchIcon className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100"
            aria-label="Notifications"
          >
            <BellIcon className="h-6 w-6" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
        <form
          className="mx-auto max-w-3xl space-y-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setSubmitting(true);
            try {
              // 1) Upload photos (Storage) → URLs
              let imageUrls: string[] = [];
              if (files.length > 0) {
                const fd = new FormData();
                files.forEach((f) => fd.append("files", f));
                const up = await fetch("/api/uploads/annonces", {
                  method: "POST",
                  body: fd,
                  credentials: "include",
                });
                const upJson = (await up.json()) as { urls?: string[]; error?: string };
                if (!up.ok) {
                  setError(upJson.error || "Upload des photos impossible.");
                  return;
                }
                imageUrls = upJson.urls ?? [];
              }

              const res = await fetch("/api/annonces", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  title,
                  category,
                  condition,
                  description,
                  price,
                  city,
                  delivery,
                  images: imageUrls,
                }),
              });
              const data = (await res.json()) as {
                annonce?: { id?: string };
                error?: string;
              };
              if (!res.ok) {
                setError(data.error || "Impossible de publier l’annonce.");
                return;
              }
              router.push("/profil/annonces");
              router.refresh();
            } catch {
              setError("Erreur réseau. Réessaie.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {error ? (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <div>
            <input
              id={fileId}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="sr-only"
              multiple
              onChange={(e) => {
                const list = Array.from(e.target.files ?? []).slice(0, 8);
                setFiles(list);
                const n = list.length;
                setFileName(n > 0 ? `${n} fichier(s) sélectionné(s)` : null);
                setPreviews(list.map((f) => URL.createObjectURL(f)));
              }}
            />
            <label
              htmlFor={fileId}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center transition-colors hover:border-teal-300 hover:bg-teal-50/30"
            >
              <PhotoPlusIcon className="h-10 w-10 text-gray-400" />
              <span className="mt-3 text-sm font-medium text-gray-700">
                Ajouter des photos
              </span>
              <span className="mt-1 text-xs text-gray-500">
                PNG, JPG jusqu&apos;à 10 Mo
              </span>
              {fileName ? (
                <span className="mt-2 text-xs font-medium text-teal-600">{fileName}</span>
              ) : null}
              <span className="mt-3 text-xs text-gray-500">{photosHelp}</span>
            </label>
          </div>

          {previews.length > 0 ? (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {previews.map((src, i) => (
                <li
                  key={`${src}-${i}`}
                  className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, 25vw"
                    unoptimized={!isSupabasePublicStorageUrl(src)}
                  />
                </li>
              ))}
            </ul>
          ) : null}

          <div>
            <label htmlFor="titre" className="mb-2 block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              id="titre"
              name="titre"
              type="text"
              placeholder="Veste en jean"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="categorie" className="mb-2 block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                id="categorie"
                name="categorie"
                value={category}
                onChange={(e) => setCategory(e.target.value as (typeof CATEGORIES)[number])}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="etat" className="mb-2 block text-sm font-medium text-gray-700">
                État
              </label>
              <select
                id="etat"
                name="etat"
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value as (typeof CONDITIONS)[number])
                }
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Veste en jean en très bon état, peu portée."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="prix" className="mb-2 block text-sm font-medium text-gray-700">
                Prix
              </label>
              <div className="flex rounded-xl border border-gray-200 bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20">
                <input
                  id="prix"
                  name="prix"
                  type="number"
                  min={0}
                  placeholder="150"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="min-w-0 flex-1 rounded-l-xl border-0 bg-transparent px-4 py-3 text-gray-900 outline-none"
                />
                <span className="flex shrink-0 items-center rounded-r-xl border-l border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-600">
                  DH
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="lieu" className="mb-2 block text-sm font-medium text-gray-700">
                Lieu
              </label>
              <select
                id="lieu"
                name="lieu"
                value={city}
                onChange={(e) => setCity(e.target.value as (typeof CITIES)[number])}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3">
            <span className="text-sm font-medium text-gray-800">Livraison disponible</span>
            <button
              type="button"
              role="switch"
              aria-checked={delivery}
              tabIndex={0}
              onClick={() => setDelivery((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setDelivery((v) => !v);
                }
              }}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                delivery ? "bg-teal-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                  delivery ? "left-[calc(100%-1.625rem)]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 sm:text-base"
          >
            {submitting ? "Publication…" : "Publier l'annonce"}
          </button>
        </form>
      </div>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75v-.109V8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function PhotoPlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75M8.25 8.25h7.875a1.125 1.125 0 0 1 1.125 1.125v9.375a1.125 1.125 0 0 1-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125V9.375a1.125 1.125 0 0 1 1.125-1.125Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9" />
    </svg>
  );
}
