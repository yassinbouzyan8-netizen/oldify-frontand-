import { SiteHeader } from "@/components/home/site-header";
import { VendreSidebar } from "@/components/vendre/vendre-sidebar";

export default function ProfilVentesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      <VendreSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <SiteHeader showBell />
        {children}
      </div>
    </div>
  );
}
