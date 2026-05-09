import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Accueil | Oldify",
    template: "%s | Oldify",
  },
  description: "Achetez et vendez des articles de seconde main sur Oldify.",
  /**
   * Favicon : fichiers convention Next.js `app/icon.png` et `app/apple-icon.png`
   * (copie de public/imges/logo/image.png). Si tu changes le logo, recopie vers ces deux fichiers.
   */
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
