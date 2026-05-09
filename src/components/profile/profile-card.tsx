import Link from "next/link";
import type { ReactNode } from "react";

type ProfileCardProps = {
  href: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
};

export function ProfileCard({ href, icon, title, subtitle }: ProfileCardProps) {
  return (
    <Link
      href={href}
      className="flex gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors hover:border-teal-200 hover:bg-teal-50/30"
    >
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{subtitle}</p>
      </div>
    </Link>
  );
}

export function IconWrap({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${className}`}
    >
      {children}
    </div>
  );
}
