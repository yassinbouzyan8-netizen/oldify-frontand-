export type PurchaseTab = "en-cours" | "termines" | "annules";

export type Purchase = {
  id: string;
  title: string;
  price: number;
  image: string;
  status: PurchaseTab;
  seller: string;
  annonceId: string;
};

export const PURCHASES: Purchase[] = [
  {
    id: "p1",
    title: "Sac à main",
    price: 250,
    image: "/imges/produit/Sacmain.png",
    status: "en-cours",
    seller: "Sara",
    annonceId: "1",
  },
  {
    id: "p2",
    title: "Casque Sony",
    price: 300,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    status: "en-cours",
    seller: "Mehdi",
    annonceId: "7",
  },
  {
    id: "p3",
    title: "Livre Harry Potter",
    price: 80,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop",
    status: "termines",
    seller: "Imane",
    annonceId: "5",
  },
  {
    id: "p4",
    title: "Veste en jean",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=200&h=200&fit=crop",
    status: "termines",
    seller: "Yassine",
    annonceId: "7",
  },
  {
    id: "p5",
    title: "Montre connectée",
    price: 450,
    image: "/imges/produit/watch.png",
    status: "annules",
    seller: "Omar",
    annonceId: "3",
  },
];

export function purchaseCount(tab: PurchaseTab): number {
  return PURCHASES.filter((p) => p.status === tab).length;
}
