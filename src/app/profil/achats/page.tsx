import type { Metadata } from "next";
import { MesAchatsView } from "@/components/profil-achats/mes-achats-view";

export const metadata: Metadata = {
  title: "Mes achats",
  description: "Suivez vos achats sur Oldify.",
};

export default function MesAchatsPage() {
  return <MesAchatsView />;
}
