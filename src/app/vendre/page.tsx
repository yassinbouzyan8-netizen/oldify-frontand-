import type { Metadata } from "next";
import { PublierAnnonceForm } from "@/components/vendre/publier-annonce-form";

export const metadata: Metadata = {
  title: "Publier une annonce",
  description: "Créez une nouvelle annonce sur Oldify.",
};

export default function VendrePage() {
  return <PublierAnnonceForm />;
}
