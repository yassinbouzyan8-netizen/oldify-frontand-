import type { Metadata } from "next";
import { MesVentesView } from "@/components/profil-ventes/mes-ventes-view";

export const metadata: Metadata = {
  title: "Mes ventes",
  description: "Suivez vos ventes sur Oldify.",
};

export default function MesVentesPage() {
  return <MesVentesView />;
}
