import type { Product } from "@/types/entities";

export interface WishlistLine {
  product: Product;
  addedAt: string;
}

export interface WishlistSnapshot {
  items: WishlistLine[];
  itemCount: number;
}
