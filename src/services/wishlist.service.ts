import { AppError } from "@/lib/http/api-error";
import type { AddWishlistItemInput } from "@/lib/validation/wishlist.schema";
import {
  deleteWishlistItem,
  getWishlistItem,
  listWishlistItems,
  putWishlistItem,
} from "@/repositories/wishlist.repository";
import { getProductById } from "@/repositories/product.repository";
import type { WishlistItem } from "@/types/entities";
import type { WishlistLine, WishlistSnapshot } from "@/types/wishlist";

export async function getWishlist(userId: string): Promise<WishlistSnapshot> {
  const storedItems = await listWishlistItems(userId);

  const lines = await Promise.all(
    storedItems.map(async (item): Promise<WishlistLine | null> => {
      const product = await getProductById(item.productId);
      if (!product) return null;

      return {
        product,
        addedAt: item.addedAt,
      };
    }),
  );

  const items = lines
    .filter((line): line is WishlistLine => line !== null)
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt));

  return {
    items,
    itemCount: items.length,
  };
}

export async function addToWishlist(
  userId: string,
  input: AddWishlistItemInput,
): Promise<WishlistItem> {
  const product = await getProductById(input.productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const existing = await getWishlistItem(userId, input.productId);
  if (existing) return existing;

  return putWishlistItem({
    userId,
    productId: input.productId,
    addedAt: new Date().toISOString(),
  });
}

export async function removeFromWishlist(
  userId: string,
  productId: string,
): Promise<void> {
  const removed = await deleteWishlistItem(userId, productId);

  if (!removed) {
    throw new AppError("Wishlist item not found", 404);
  }
}
