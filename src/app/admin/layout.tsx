import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SiteHeader } from "@/components/home/site-header";
import { getCurrentUser } from "@/lib/auth-server";
import { isAdminUser } from "@/lib/auth-role";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  if (!isAdminUser(user)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-gray-900">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <SiteHeader />
        <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Espace admin
          </p>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
