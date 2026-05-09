import Image from "next/image";
import Link from "next/link";
import type { AnnonceDetail } from "@/data/annonce-details";

type Props = {
  detail: AnnonceDetail;
};

export function AnnonceDetailView({ detail }: Props) {
  const { product, breadcrumb, condition, postedText, description, specs, tags, shipping, seller } =
    detail;

  return (
    <div className="pb-10 pt-4 sm:pb-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Fil d’Ariane */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Fil d’Ariane">
          <ol className="flex flex-wrap items-center gap-1.5">
            {breadcrumb.map((item, i) => (
              <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 ? <span className="text-gray-300">/</span> : null}
                {i < breadcrumb.length - 1 ? (
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-teal-600"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-900">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image */}
            <div className="relative aspect-square w-full max-w-xl overflow-hidden rounded-xl bg-white lg:max-w-none">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <button
                type="button"
                className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-teal-700"
                aria-label="Historique de l’annonce"
              >
                <ClockIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Infos */}
            <div className="flex min-w-0 flex-col">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {product.title}
              </h1>
              <p className="mt-3 text-3xl font-bold text-teal-600 sm:text-4xl">
                {product.price} DH
              </p>
              <p className="mt-2 text-sm font-medium text-gray-700">{condition}</p>
              <p className="mt-1 text-sm text-gray-500">{postedText}</p>

              {/* Vendeur */}
              <div className="mt-8 rounded-xl border border-gray-100 bg-white p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-white">
                      <Image
                        src={seller.avatar}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{seller.name}</p>
                      <p className="mt-0.5 flex items-center gap-1 text-sm text-gray-600">
                        <StarIcon className="h-4 w-4 text-amber-400" />
                        <span>
                          <strong className="font-semibold text-gray-900">
                            {seller.rating}
                          </strong>
                          <span className="text-gray-500">
                            {" "}
                            ({seller.reviews} évaluations)
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/profil/messages?to=${encodeURIComponent(seller.name)}`}
                    className="inline-flex shrink-0 items-center justify-center rounded-xl border-2 border-teal-600 bg-white px-5 py-2.5 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50"
                  >
                    Contacter
                  </Link>
                </div>
              </div>

              <p className="mt-8 text-sm leading-relaxed text-gray-700 sm:text-base">
                {description}
              </p>

              <dl className="mt-8 space-y-3 border-t border-gray-100 pt-8">
                {specs.map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between gap-4 text-sm sm:text-base"
                  >
                    <dt className="text-gray-500">{row.label}</dt>
                    <dd className="font-medium text-gray-900">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/?q=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 transition-colors hover:bg-teal-100 sm:text-sm"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              <div className="mt-10 border-t border-gray-100 pt-8">
                <h2 className="text-base font-bold text-gray-900">
                  Informations de livraison
                </h2>
                <ul className="mt-4 space-y-3">
                  {shipping.map((line) => (
                    <li key={line} className="flex gap-2 text-sm text-gray-700 sm:text-base">
                      <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-8 sm:mt-10 sm:flex-row sm:gap-4">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-teal-600 bg-white px-4 py-3 text-sm font-semibold text-teal-600 transition-colors hover:bg-teal-50 sm:w-auto sm:px-6"
            >
              <HeartOutline className="h-5 w-5" />
              <span className="hidden sm:inline">Ajouter aux favoris</span>
              <span className="sm:hidden">Favoris</span>
            </button>
            <button
              type="button"
              className="w-full rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 sm:flex-1 sm:text-base"
            >
              Acheter
            </button>
          </div>
      </div>
    </div>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.249 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.248-5.273-4.116-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function HeartOutline({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      />
    </svg>
  );
}
