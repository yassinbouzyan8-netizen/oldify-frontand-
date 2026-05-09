import type { Metadata } from "next";
import { MesFavorisView } from "@/components/profil-favoris/mes-favoris-view";

export const metadata: Metadata = {
  title: "Favoris",
  description: "Vos articles favoris sur Oldify.",
};

export default function FavorisPage() {
  return <MesFavorisView />;
}
