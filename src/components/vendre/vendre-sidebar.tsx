"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";

type NavItem = {
  href: string;
  label: string;
  Icon: FC<{ className?: string }>;
  match?: "home" | "profil" | "prefix" | "exact";
};

const mainNav: NavItem[] = [
  { href: "/", label: "Accueil", Icon: IconHome, match: "home" },
  { href: "/", label: "Explorer", Icon: IconCompass },
  { href: "/profil/messages", label: "Messages", Icon: IconChat, match: "prefix" },
  { href: "/profil/favoris", label: "Favoris", Icon: IconHeart, match: "prefix" },
  { href: "/profil/achats", label: "Mes achats", Icon: IconBag, match: "prefix" },
  { href: "/profil/ventes", label: "Mes ventes", Icon: IconArrow, match: "prefix" },
  { href: "/profil", label: "Profil", Icon: IconUser, match: "profil" },
];

const annonceNav: NavItem[] = [
  {
    href: "/vendre",
    label: "Publier une annonce",
    Icon: IconPlusCircle,
    match: "exact",
  },
  {
    href: "/profil/annonces",
    label: "Mes annonces",
    Icon: IconDocument,
    match: "prefix",
  },
];

function isActive(item: NavItem, pathname: string): boolean {
  if (item.match === "home") return pathname === "/";
  if (item.match === "profil") return pathname === "/profil";
  if (item.match === "exact") return pathname === item.href;
  if (item.match === "prefix")
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  return false;
}

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActive(item, pathname);
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-gray-200/80 text-gray-900"
          : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
      }`}
    >
      <item.Icon className="h-5 w-5 shrink-0 text-gray-500" />
      {item.label}
    </Link>
  );
}

export function VendreSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-gray-50 md:w-64">
      <div className="p-4 md:p-5">
        <Link href="/" className="inline-block">
          <Image
            src="/imges/logo/image.png"
            alt="Oldify"
            width={110}
            height={34}
            className="h-auto w-28 object-contain object-left"
            priority
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-4 px-2 pb-4" aria-label="Navigation">
        <div className="flex flex-col gap-0.5">
          {mainNav.map((item) => (
            <NavLink key={item.label} item={item} pathname={pathname} />
          ))}
        </div>

        <div className="border-t border-gray-200/80 pt-3">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Annonces
          </p>
          <div className="flex flex-col gap-0.5">
            {annonceNav.map((item) => (
              <NavLink key={item.label} item={item} pathname={pathname} />
            ))}
          </div>
        </div>
      </nav>

      <div className="mt-auto border-t border-gray-200/80 p-4 md:p-5">
        <Link
          href="/vendre"
          className="flex w-full items-center justify-center rounded-xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
        >
          Vends tes articles
        </Link>
      </div>
    </aside>
  );
}

function IconPlusCircle({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function IconHome({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function IconCompass({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3m9-9h-3M6 12H3m12.95 4.95-2.12-2.12M9.17 9.17 7.05 7.05M9.17 14.83l-2.12 2.12M14.83 9.17l2.12-2.12" />
    </svg>
  );
}

function IconChat({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337L5.454 21.06a.75.75 0 0 1-1.06-1.06l1.714-3.568a9.22 9.22 0 0 1-1.649-4.135 8.959 8.959 0 0 1-.091-1.661C3.75 7.516 7.516 3.75 12 3.75s8.25 3.766 8.25 8.25Z" />
    </svg>
  );
}

function IconHeart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function IconDocument({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75M8.25 8.25h7.875a1.125 1.125 0 0 1 1.125 1.125v9.375a1.125 1.125 0 0 1-1.125 1.125H5.25a1.125 1.125 0 0 1-1.125-1.125V9.375a1.125 1.125 0 0 1 1.125-1.125Z" />
    </svg>
  );
}

function IconBag({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  );
}

function IconArrow({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}
