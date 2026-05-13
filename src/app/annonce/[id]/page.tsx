import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnonceDetailView } from "@/components/annonce/annonce-detail-view";
import { getAllAnnonceIds, getAnnonceById } from "@/data/annonce-details";
import type { AnnonceDetail } from "@/data/annonce-details";
import type { AnnonceRow } from "@/lib/annonce-types";
import { displayNameFromUser } from "@/lib/auth-display-name";
import type { AppUser } from "@/lib/auth-app-user";
import { supabaseAdminRest } from "@/lib/supabase-admin-rest";
import { supabaseRest } from "@/lib/supabase-rest";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAllAnnonceIds().map((id) => ({ id }));
}

async function fetchOwnerForAnnonce(
  ownerId: string,
): Promise<{ email: string; full_name: string | null } | null> {
  const id = ownerId?.trim();
  if (!id) return null;
  try {
    const { data, status } = await supabaseAdminRest<
      Array<{ email: string; full_name: string | null }>
    >(
      `/app_users?select=email,full_name&id=eq.${encodeURIComponent(id)}&limit=1`,
      { method: "GET" },
    );
    if (status >= 400 || !Array.isArray(data) || !data[0]) return null;
    return data[0];
  } catch {
    return null;
  }
}

async function getAnnonceFromDb(id: string): Promise<AnnonceDetail | null> {
  const safe = encodeURIComponent(id);
  const { data, status } = await supabaseRest<AnnonceRow[]>(
    `/annonces?select=*&id=eq.${safe}&limit=1`,
    { method: "GET" },
  );
  if (status >= 400) return null;
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;

  const owner = await fetchOwnerForAnnonce(row.owner_id);
  const sellerUser: AppUser | null = owner
    ? {
        id: row.owner_id,
        email: owner.email,
        full_name: owner.full_name,
        role: "user",
      }
    : null;
  const sellerName = sellerUser ? displayNameFromUser(sellerUser) : "Vendeur";

  const categoryLabel = row.category || "Autres";
  const breadcrumb = [
    { label: "Accueil", href: "/" },
    { label: categoryLabel, href: "/" },
    { label: row.title, href: `/annonce/${row.id}` },
  ];

  return {
    product: {
      id: row.id,
      title: row.title,
      price: Number(row.price) || 0,
      image: row.images?.[0] || "/imges/produit/Sacmain.png",
      category: "other",
    },
    breadcrumb,
    condition: row.condition || "Bon état",
    postedText: `Publié à ${row.city}`,
    description: row.description,
    specs: [
      { label: "Ville", value: row.city },
      { label: "Livraison", value: row.delivery ? "Disponible" : "Non" },
      { label: "Catégorie", value: categoryLabel },
    ],
    tags: [categoryLabel],
    shipping: row.delivery
      ? ["Livraison disponible", `Remise en main propre à ${row.city}`]
      : [`Remise en main propre à ${row.city}`],
    seller: {
      name: sellerName,
      avatar: "/imges/image.png",
      rating: 4.8,
      reviews: 0,
      email: owner?.email ?? null,
    },
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = getAnnonceById(id) ?? (await getAnnonceFromDb(id));
  if (!detail) return { title: "Annonce introuvable" };
  return {
    title: detail.product.title,
    description: detail.description.slice(0, 160),
  };
}

export default async function AnnoncePage({ params }: Props) {
  const { id } = await params;
  const detail = getAnnonceById(id) ?? (await getAnnonceFromDb(id));
  if (!detail) notFound();

  return <AnnonceDetailView detail={detail} />;
}
