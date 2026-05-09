import { PRODUCTS, type Product } from "./products";

/** Identifiants des annonces en favoris (démo). */
const FAVORITE_IDS = new Set(["1", "3", "4", "7"]);

export function getFavoriteProducts(): Product[] {
  return PRODUCTS.filter((p) => FAVORITE_IDS.has(p.id));
}
