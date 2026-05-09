import type { Metadata } from "next";
import { MesAnnoncesView } from "@/components/profil-annonces/mes-annonces-view";

export const metadata: Metadata = {
  title: "Mes annonces",
  description: "Gérez vos annonces Oldify.",
};

export default function MesAnnoncesPage() {
  return <MesAnnoncesView />;
}
