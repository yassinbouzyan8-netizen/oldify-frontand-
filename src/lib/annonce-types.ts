export type AnnonceStatus = "en-ligne" | "en-attente" | "vendue";

export type AnnonceRow = {
  id: string;
  owner_id: string;
  title: string;
  category: string;
  condition: string;
  description: string;
  price: number;
  city: string;
  delivery: boolean;
  images: string[];
  status: AnnonceStatus | string;
  created_at: string;
};

export type CreateAnnonceInput = {
  title: string;
  category: string;
  condition: string;
  description: string;
  price: number;
  city: string;
  delivery: boolean;
  images?: string[];
};

