import { HomeCatalog } from "@/components/home/home-catalog";
import { SiteHeader } from "@/components/home/site-header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <SiteHeader />
      <HomeCatalog />
    </div>
  );
}
