import Image from "next/image";
import Link from "next/link";
import { AdminHeaderLink } from "./admin-header-link";
import { LogoutButton } from "./logout-button";
import { HeaderProfileLink } from "./header-profile-link";

type SiteHeaderProps = {
  /** Affiche la cloche avec pastille (ex. page profil) */
  showBell?: boolean;
};

export function SiteHeader({ showBell = false }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:gap-6 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0">
          <Image
            src="/imges/logo/image.png"
            alt="Oldify"
            width={120}
            height={36}
            className="h-auto w-28 object-contain object-left sm:w-32"
            priority
          />
        </Link>

        <div className="relative min-w-0 flex-1 max-w-2xl mx-auto">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon className="h-5 w-5" />
          </span>
          <input
            type="search"
            name="q"
            placeholder="Rechercher des articles"
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
            aria-label="Rechercher des articles"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {showBell ? (
            <button
              type="button"
              className="relative rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              aria-label="Notifications"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
          ) : null}
          <Link
            href="/vendre"
            className="hidden rounded-full bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700 sm:inline-flex"
          >
            Vends tes articles
          </Link>
          <AdminHeaderLink />
          <HeaderProfileLink />
          <LogoutButton />
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-2 sm:hidden">
        <Link
          href="/vendre"
          className="flex w-full items-center justify-center rounded-full bg-teal-600 py-2.5 text-sm font-semibold text-white"
        >
          Vends tes articles
        </Link>
      </div>
    </header>
  );
}

function BellIcon({ className }: { className?: string }) {
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
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75v-.109V8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
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
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}
