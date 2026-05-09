export type ListingStatus = "en-ligne" | "en-attente" | "vendue";

export type UserListing = {
  id: string;
  title: string;
  price: number;
  image: string;
  status: ListingStatus;
  views: number;
  likes: number;
};

export const USER_LISTINGS: UserListing[] = [
  {
    id: "7",
    title: "Veste en jean",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=200&h=200&fit=crop",
    status: "en-ligne",
    views: 124,
    likes: 8,
  },
  {
    id: "1",
    title: "Sac à main",
    price: 250,
    image: "/imges/produit/Sacmain.png",
    status: "en-ligne",
    views: 89,
    likes: 14,
  },
  {
    id: "3",
    title: "Montre",
    price: 450,
    image: "/imges/produit/watch.png",
    status: "en-ligne",
    views: 56,
    likes: 3,
  },
  {
    id: "2",
    title: "Chaussures sport",
    price: 350,
    image: "/imges/produit/tichirt.png",
    status: "en-attente",
    views: 12,
    likes: 1,
  },
  {
    id: "4",
    title: "iPhone 13 Pro Max",
    price: 7200,
    image: "/imges/produit/iphone13promax.png",
    status: "vendue",
    views: 210,
    likes: 22,
  },
  {
    id: "5",
    title: "Appareil photo",
    price: 1200,
    image: "/imges/produit/camera.png",
    status: "vendue",
    views: 178,
    likes: 9,
  },
];

export function countByStatus(status: ListingStatus): number {
  return USER_LISTINGS.filter((l) => l.status === status).length;
}
