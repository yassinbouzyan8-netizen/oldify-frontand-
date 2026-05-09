import type { Metadata } from "next";
import { SiteHeader } from "@/components/home/site-header";
import { ProfileContent } from "@/components/profile/profile-content";

export const metadata: Metadata = {
  title: "Mon profil",
  description: "Gérez votre compte et vos activités Oldify.",
};

export default function ProfilPage() {
  return (
    <>
      <SiteHeader showBell />
      <ProfileContent />
    </>
  );
}
