import Link from "next/link";

const nav = [{ href: "/admin", label: "Tableau de bord" }];

export function AdminSidebar() {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="sticky top-0 flex h-screen flex-col gap-1 px-3 py-6">
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Administration
        </p>
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
