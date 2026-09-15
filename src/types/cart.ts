import type { Product } from "@/types/entities";

export interface CartLine {
  product: Product;
  quantity: number;
  lineTotal: number;
  addedAt: string;
  updatedAt: string;
}

export interface CartSnapshot {
  items: CartLine[];
  itemCount: number;
  subtotal: number;
}
