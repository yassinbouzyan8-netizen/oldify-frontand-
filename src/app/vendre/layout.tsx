import { VendreSidebar } from "@/components/vendre/vendre-sidebar";

export default function VendreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      <VendreSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
