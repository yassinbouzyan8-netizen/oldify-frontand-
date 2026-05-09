import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AnnonceDetailView } from "@/components/annonce/annonce-detail-view";
import { getAllAnnonceIds, getAnnonceById } from "@/data/annonce-details";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAllAnnonceIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = getAnnonceById(id);
  if (!detail) return { title: "Annonce introuvable" };
  return {
    title: detail.product.title,
    description: detail.description.slice(0, 160),
  };
}

export default async function AnnoncePage({ params }: Props) {
  const { id } = await params;
  const detail = getAnnonceById(id);
  if (!detail) notFound();

  return <AnnonceDetailView detail={detail} />;
}
