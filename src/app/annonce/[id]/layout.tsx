import { SiteHeader } from "@/components/home/site-header";

export default function AnnonceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <SiteHeader showBell />
      {children}
    </div>
  );
}
