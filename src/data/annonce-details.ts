import {
  PRODUCTS,
  type Product,
  type ProductCategory,
} from "./products";

export type BreadcrumbItem = { label: string; href: string };

export type AnnonceDetail = {
  product: Product;
  breadcrumb: BreadcrumbItem[];
  condition: string;
  postedText: string;
  description: string;
  specs: { label: string; value: string }[];
  tags: string[];
  shipping: string[];
  seller: {
    name: string;
    avatar: string;
    rating: number;
    reviews: number;
  };
};

const CATEGORY_CRUMB: Record<
  ProductCategory,
  { label: string; href: string }
> = {
  women: { label: "Femmes", href: "/" },
  men: { label: "Hommes", href: "/" },
  electronics: { label: "Électronique", href: "/" },
  home: { label: "Maison", href: "/" },
  books: { label: "Livres", href: "/" },
  sports: { label: "Sports", href: "/" },
  kids: { label: "Enfants", href: "/" },
  other: { label: "Autres", href: "/" },
};

const SELLER = {
  name: "KENZA",
  avatar: "/imges/image.png",
  rating: 4.8,
  reviews: 126,
} as const;

const DEFAULT_SHIPPING = [
  "Livraison disponible dans tout le Maroc",
  "Remise en main propre à Casablanca",
] as const;

/** Détails spécifiques par id d’annonce (complétés par défaut si absent). */
const OVERRIDES: Record<
  string,
  Partial<
    Pick<
      AnnonceDetail,
      | "breadcrumb"
      | "condition"
      | "postedText"
      | "description"
      | "specs"
      | "tags"
      | "shipping"
    >
  >
> = {
  "7": {
    breadcrumb: [
      { label: "Accueil", href: "/" },
      { label: "Femmes", href: "/" },
      { label: "Vestes", href: "/" },
    ],
    condition: "Très bon état",
    postedText: "Publié il y a 2 jours à Casablanca",
    description: "Veste en jean en très bon état, peu portée.",
    specs: [
      { label: "Taille", value: "M" },
      { label: "Marque", value: "Zara" },
      { label: "Couleur", value: "Bleu" },
    ],
    tags: ["veste", "jean", "zara", "bleu"],
    shipping: [...DEFAULT_SHIPPING],
  },
  "1": {
    breadcrumb: [
      { label: "Accueil", href: "/" },
      { label: "Femmes", href: "/" },
      { label: "Sacs", href: "/" },
    ],
    condition: "Très bon état",
    postedText: "Publié il y a 5 jours à Casablanca",
    description: "Sac à main soigné, peu utilisé. Idéal au quotidien.",
    specs: [
      { label: "Matière", value: "Cuir / toile" },
      { label: "Couleur", value: "Beige / marron" },
    ],
    tags: ["sac", "main", "femme"],
    shipping: [...DEFAULT_SHIPPING],
  },
  "2": {
    breadcrumb: [
      { label: "Accueil", href: "/" },
      { label: "Hommes", href: "/" },
      { label: "Vêtements", href: "/" },
    ],
    condition: "Bon état",
    postedText: "Publié il y a 1 semaine à Rabat",
    description: "T-shirt confortable, taille indiquée sur l’étiquette.",
    specs: [
      { label: "Taille", value: "L" },
      { label: "Couleur", value: "Blanc" },
    ],
    tags: ["t-shirt", "homme", "coton"],
    shipping: [...DEFAULT_SHIPPING],
  },
  "3": {
    breadcrumb: [
      { label: "Accueil", href: "/" },
      { label: "Électronique", href: "/" },
      { label: "Montres", href: "/" },
    ],
    condition: "Comme neuf",
    postedText: "Publié il y a 3 jours à Casablanca",
    description: "Montre avec chargeur et boîte d’origine.",
    specs: [
      { label: "État", value: "Comme neuf" },
      { label: "Couleur", value: "Noir" },
    ],
    tags: ["montre", "connectée", "sport"],
    shipping: [...DEFAULT_SHIPPING],
  },
  "4": {
    breadcrumb: [
      { label: "Accueil", href: "/" },
      { label: "Électronique", href: "/" },
      { label: "Téléphones", href: "/" },
    ],
    condition: "Très bon état",
    postedText: "Publié il y a 4 jours à Casablanca",
    description: "iPhone bien entretenu, batterie encore performante.",
    specs: [
      { label: "Capacité", value: "256 Go" },
      { label: "Couleur", value: "Bleu alpin" },
    ],
    tags: ["iphone", "apple", "smartphone"],
    shipping: [...DEFAULT_SHIPPING],
  },
  "5": {
    breadcrumb: [
      { label: "Accueil", href: "/" },
      { label: "Électronique", href: "/" },
      { label: "Photo", href: "/" },
    ],
    condition: "Bon état",
    postedText: "Publié il y a 6 jours à Marrakech",
    description: "Boîtier et optique en bon état. Idéal pour débuter.",
    specs: [
      { label: "Marque", value: "Canon" },
      { label: "Livraison", value: "Avec housse" },
    ],
    tags: ["photo", "canon", "reflex"],
    shipping: [...DEFAULT_SHIPPING],
  },
  "6": {
    breadcrumb: [
      { label: "Accueil", href: "/" },
      { label: "Autres", href: "/" },
      { label: "Accessoires", href: "/" },
    ],
    condition: "Neuf avec étiquette",
    postedText: "Publié hier à Casablanca",
    description: "Lot d’accessoires mode neufs.",
    specs: [{ label: "Lot", value: "Plusieurs pièces" }],
    tags: ["accessoires", "mode"],
    shipping: [...DEFAULT_SHIPPING],
  },
};

function defaultBreadcrumb(product: Product): BreadcrumbItem[] {
  const cat = CATEGORY_CRUMB[product.category];
  return [
    { label: "Accueil", href: "/" },
    cat,
    { label: product.title, href: "#" },
  ];
}

function buildDetail(product: Product): AnnonceDetail {
  const o = OVERRIDES[product.id];
  return {
    product,
    breadcrumb: o?.breadcrumb ?? defaultBreadcrumb(product),
    condition: o?.condition ?? "Bon état",
    postedText: o?.postedText ?? "Publié récemment à Casablanca",
    description:
      o?.description ??
      `${product.title} — article proposé sur Oldify, à saisir rapidement.`,
    specs: o?.specs ?? [{ label: "État", value: "Bon état" }],
    tags: o?.tags ?? [product.title.toLowerCase().replace(/\s+/g, "-")],
    shipping: o?.shipping ? [...o.shipping] : [...DEFAULT_SHIPPING],
    seller: { ...SELLER },
  };
}

export function getAnnonceById(id: string): AnnonceDetail | null {
  const product = PRODUCTS.find((p) => p.id === id);
  if (!product) return null;
  return buildDetail(product);
}

export function getAllAnnonceIds(): string[] {
  return PRODUCTS.map((p) => p.id);
}
