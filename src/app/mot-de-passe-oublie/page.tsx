import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mot de passe oublié | Oldify",
  description: "Réinitialisation du mot de passe Oldify",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
      <p className="mt-3 text-sm text-gray-600">
        Cette page sera reliée à ton flux de réinitialisation (e-mail ou API).
        En attendant, utilise la page de connexion ou recrée un compte en mode
        démo local.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex text-sm font-medium text-teal-600 underline-offset-4 hover:text-teal-800 hover:underline"
      >
        Retour à la connexion
      </Link>
    </div>
  );
}
