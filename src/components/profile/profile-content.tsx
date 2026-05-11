import Link from "next/link";
import { ProfileCard, IconWrap } from "./profile-card";
import { ProfileIdentity } from "./profile-identity";
import {
  IconBell,
  IconBriefcase,
  IconCard,
  IconChat,
  IconCog,
  IconExchange,
  IconGift,
  IconHeart,
  IconHelp,
  IconLeaf,
  IconPin,
  IconRecycle,
  IconSaleArrow,
  IconShieldLeaf,
  IconShieldLock,
  IconShopping,
  IconStar,
} from "./profile-icons";

export function ProfileContent() {
  return (
    <div className="bg-gray-50/80 pb-12">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Bloc identité */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <ProfileIdentity>
              <ul className="mt-5 flex flex-col gap-3 text-sm text-gray-700 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-2">
                <li className="flex items-center gap-2">
                  <IconStar className="h-5 w-5 text-amber-400" />
                  <span>
                    <strong className="font-semibold text-gray-900">0.0</strong>
                    <span className="text-gray-500"> (0 évaluations)</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <IconLeaf className="h-5 w-5 text-teal-600" />
                  <span>
                    <strong className="font-semibold text-gray-900">0</strong>
                    <span className="text-gray-500"> Score écologique</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <IconPin className="h-5 w-5 text-red-500" />
                  <span className="text-gray-500">—</span>
                </li>
              </ul>
            </ProfileIdentity>

            <Link
              href="/profil/public"
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:border-teal-300 hover:bg-teal-50/50"
            >
              Voir mon profil public
            </Link>
          </div>
        </section>

        {/* Mes activités */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Mes activités</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <ProfileCard
              href="/profil/annonces"
              title="Mes annonces"
              subtitle="Gérez vos articles en vente"
              icon={
                <IconWrap className="bg-orange-100 text-orange-700">
                  <IconBriefcase className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/ventes"
              title="Mes ventes"
              subtitle="Historique et suivi des ventes"
              icon={
                <IconWrap className="bg-sky-100 text-sky-700">
                  <IconSaleArrow className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/achats"
              title="Mes achats"
              subtitle="Commandes et reçus"
              icon={
                <IconWrap className="bg-amber-100 text-amber-800">
                  <IconShopping className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/favoris"
              title="Favoris"
              subtitle="Articles sauvegardés"
              icon={
                <IconWrap className="bg-rose-100 text-rose-600">
                  <IconHeart className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/messages"
              title="Messages"
              subtitle="Conversations avec acheteurs et vendeurs"
              icon={
                <IconWrap className="bg-violet-100 text-violet-700">
                  <IconChat className="h-6 w-6" />
                </IconWrap>
              }
            />
          </div>
        </section>

        {/* Oldify Features */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Oldify Features</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ProfileCard
              href="/profil/echanges"
              title="Mes échanges"
              subtitle="Troc et échanges entre membres"
              icon={
                <IconWrap className="bg-blue-100 text-blue-700">
                  <IconExchange className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/dons"
              title="Mes dons"
              subtitle="Dons solidaires et associatifs"
              icon={
                <IconWrap className="bg-red-100 text-red-600">
                  <IconGift className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/recyclages"
              title="Mes recyclages"
              subtitle="Recyclage et seconde vie des objets"
              icon={
                <IconWrap className="bg-emerald-100 text-emerald-700">
                  <IconRecycle className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/impact"
              title="Impact écologique"
              subtitle="Votre contribution à l’environnement"
              icon={
                <IconWrap className="bg-teal-100 text-teal-700">
                  <IconShieldLeaf className="h-6 w-6" />
                </IconWrap>
              }
            />
          </div>
        </section>

        {/* Compte */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold text-gray-900">Compte</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ProfileCard
              href="/profil/parametres"
              title="Paramètres"
              subtitle="Compte, langue et confidentialité"
              icon={
                <IconWrap className="bg-purple-100 text-purple-700">
                  <IconCog className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/paiements"
              title="Paiements"
              subtitle="Cartes et moyens de paiement"
              icon={
                <IconWrap className="bg-blue-100 text-blue-700">
                  <IconCard className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/notifications"
              title="Notifications"
              subtitle="Alertes e-mail et push"
              icon={
                <IconWrap className="bg-amber-100 text-amber-700">
                  <IconBell className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/securite"
              title="Sécurité"
              subtitle="Mot de passe et connexion"
              icon={
                <IconWrap className="bg-emerald-100 text-emerald-700">
                  <IconShieldLock className="h-6 w-6" />
                </IconWrap>
              }
            />
            <ProfileCard
              href="/profil/aide"
              title="Centre d&apos;aide"
              subtitle="FAQ et contact support"
              icon={
                <IconWrap className="bg-violet-100 text-violet-700">
                  <IconHelp className="h-6 w-6" />
                </IconWrap>
              }
            />
          </div>
        </section>
      </div>
    </div>
  );
}
