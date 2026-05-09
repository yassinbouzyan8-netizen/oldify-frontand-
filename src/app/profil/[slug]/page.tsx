import Link from "next/link";
import { SiteHeader } from "@/components/home/site-header";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProfilSectionPage({ params }: Props) {
  const { slug } = await params;
  const label = slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <>
      <SiteHeader showBell />
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-teal-600">
          Profil
        </p>
        <h1 className="mt-2 text-2xl font-bold capitalize text-gray-900">{label}</h1>
        <p className="mt-3 text-gray-600">
          Cette section sera bientôt disponible.
        </p>
        <Link
          href="/profil"
          className="mt-8 inline-block font-medium text-teal-600 hover:text-teal-700 hover:underline"
        >
          Retour au profil
        </Link>
      </div>
    </>
  );
}
