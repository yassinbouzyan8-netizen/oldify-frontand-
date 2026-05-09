export type SaleTab = "en-cours" | "termines" | "annules";

export type Sale = {
  id: string;
  title: string;
  price: number;
  image: string;
  status: SaleTab;
  buyer: string;
  annonceId: string;
};

export const SALES: Sale[] = [
  {
    id: "v1",
    title: "T-shirt",
    price: 120,
    image: "/imges/produit/tichirt.png",
    status: "en-cours",
    buyer: "Amine",
    annonceId: "2",
  },
  {
    id: "v2",
    title: "Accessoires mode",
    price: 180,
    image: "/imges/produit/imagecopy.png",
    status: "en-cours",
    buyer: "Lina",
    annonceId: "6",
  },
  {
    id: "v3",
    title: "Appareil photo",
    price: 1200,
    image: "/imges/produit/camera.png",
    status: "termines",
    buyer: "Karim",
    annonceId: "5",
  },
  {
    id: "v4",
    title: "iPhone 13 Pro Max",
    price: 7200,
    image: "/imges/produit/iphone13promax.png",
    status: "termines",
    buyer: "Nadia",
    annonceId: "4",
  },
  {
    id: "v5",
    title: "Montre",
    price: 450,
    image: "/imges/produit/watch.png",
    status: "annules",
    buyer: "Hicham",
    annonceId: "3",
  },
];

export function saleCount(tab: SaleTab): number {
  return SALES.filter((s) => s.status === tab).length;
}
