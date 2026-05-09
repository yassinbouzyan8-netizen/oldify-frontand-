/**
 * Catégories alignées sur la barre d’accueil (hors « Toutes »).
 * Ajoute un fichier dans `public/imges/produit/` puis une entrée ici.
 */
export type ProductCategory =
  | "women"
  | "men"
  | "electronics"
  | "home"
  | "books"
  | "sports"
  | "kids"
  | "other";

export type CatalogFilterId = "all" | ProductCategory;

export type Product = {
  id: string;
  title: string;
  price: number;
  /** Chemin sous /public, ex. /imges/produit/Sacmain.png */
  image: string;
  category: ProductCategory;
};

export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "Sac à main",
    price: 250,
    image: "/imges/produit/Sacmain.png",
    category: "women",
  },
  {
    id: "2",
    title: "T-shirt",
    price: 120,
    image: "/imges/produit/tichirt.png",
    category: "men",
  },
  {
    id: "3",
    title: "Montre",
    price: 450,
    image: "/imges/produit/watch.png",
    category: "electronics",
  },
  {
    id: "4",
    title: "iPhone 13 Pro Max",
    price: 7200,
    image: "/imges/produit/iphone13promax.png",
    category: "electronics",
  },
  {
    id: "5",
    title: "Appareil photo",
    price: 1200,
    image: "/imges/produit/camera.png",
    category: "electronics",
  },
  {
    id: "6",
    title: "Accessoires mode",
    price: 180,
    image: "/imges/produit/imagecopy.png",
    category: "other",
  },
  {
    id: "7",
    title: "Veste en jean",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=900&h=900&fit=crop",
    category: "women",
  },
];
