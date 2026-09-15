import { AppError } from "@/lib/http/api-error";
import type {
  AddCartItemInput,
  UpdateCartItemInput,
} from "@/lib/validation/cart.schema";
import {
  deleteCartItem,
  getCartItem,
  listCartItems,
  putCartItem,
  updateCartItemQuantity,
} from "@/repositories/cart.repository";
import { getProductById } from "@/repositories/product.repository";
import type { CartSnapshot, CartLine } from "@/types/cart";
import type { CartItem } from "@/types/entities";

export async function getCart(userId: string): Promise<CartSnapshot> {
  const cartItems = await listCartItems(userId);

  const lines = await Promise.all(
    cartItems.map(async (item): Promise<CartLine | null> => {
      const product = await getProductById(item.productId);

      if (!product) return null;

      return {
        product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
        addedAt: item.addedAt,
        updatedAt: item.updatedAt,
      };
    }),
  );

  const items = lines.filter((line): line is CartLine => line !== null);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);

  return {
    items,
    itemCount,
    subtotal,
  };
}

export async function addToCart(
  userId: string,
  input: AddCartItemInput,
): Promise<CartItem> {
  const product = await getProductById(input.productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock < 1) {
    throw new AppError("This product is currently out of stock", 409);
  }

  const existing = await getCartItem(userId, input.productId);
  const nextQuantity = (existing?.quantity ?? 0) + input.quantity;

  if (nextQuantity > product.stock) {
    throw new AppError(
      `Only ${product.stock} ${product.stock === 1 ? "item is" : "items are"} available`,
      409,
    );
  }

  const now = new Date().toISOString();

  if (existing) {
    const updated = await updateCartItemQuantity(
      userId,
      input.productId,
      nextQuantity,
      now,
    );

    if (!updated) {
      throw new AppError("Cart item could not be updated", 500);
    }

    return updated;
  }

  return putCartItem({
    userId,
    productId: input.productId,
    quantity: input.quantity,
    addedAt: now,
    updatedAt: now,
  });
}

export async function setCartQuantity(
  userId: string,
  productId: string,
  input: UpdateCartItemInput,
): Promise<CartItem> {
  const product = await getProductById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (input.quantity > product.stock) {
    throw new AppError(
      `Only ${product.stock} ${product.stock === 1 ? "item is" : "items are"} available`,
      409,
    );
  }

  try {
    const updated = await updateCartItemQuantity(
      userId,
      productId,
      input.quantity,
      new Date().toISOString(),
    );

    if (!updated) {
      throw new AppError("Cart item not found", 404);
    }

    return updated;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      throw new AppError("Cart item not found", 404);
    }

    throw error;
  }
}

export async function removeFromCart(
  userId: string,
  productId: string,
): Promise<void> {
  const removed = await deleteCartItem(userId, productId);

  if (!removed) {
    throw new AppError("Cart item not found", 404);
  }
}
