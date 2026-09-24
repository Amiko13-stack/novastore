import { TABLES } from "@/lib/db/table-names";
import { scanAll, deleteRecord, updateRecord } from "@/repositories/admin.repository";
import type { Product, Category, User, CartItem, WishlistItem } from "@/types/entities";
import { createCategory } from "@/services/category.service";
import { createCategorySchema } from "@/lib/validation/category.schema";
import { updateUserSchema } from "@/lib/validation/user.schema";
import { AppError } from "@/lib/http/api-error";
import { slugify } from "@/utils/slugify";
import { z } from "zod";

export async function getAdminData() {
  const [products, categories, users, cart, wishlist] = await Promise.all([
    scanAll<Product>(TABLES.products), scanAll<Category>(TABLES.categories), scanAll<User>(TABLES.users),
    scanAll<CartItem>(TABLES.cart), scanAll<WishlistItem>(TABLES.wishlist),
  ]);
  return { products, categories, users, cart, wishlist };
}
const commandSchema = z.object({
  resource: z.enum(["categories", "users", "cart", "wishlist"]),
  action: z.enum(["create", "update", "delete"]),
  id: z.string().min(1).max(200).optional(),
  productId: z.string().min(1).max(200).optional(),
  values: z.record(z.string(), z.unknown()).optional(),
}).strict();

export async function ensureProductUnreferenced(productId: string) {
  const [cart, wishlist] = await Promise.all([scanAll<CartItem>(TABLES.cart), scanAll<WishlistItem>(TABLES.wishlist)]);
  if ([...cart, ...wishlist].some(item => item.productId === productId)) {
    throw new AppError("Remove this product from carts and wishlists before deleting it.", 409);
  }
}
export async function manageRecord(raw: unknown) {
  const command = commandSchema.parse(raw);
  const { resource, action, id, productId } = command;
  if (action !== "create" && !id) throw new AppError("A record ID is required.", 400);
  if (resource === "categories") {
    if (action === "create") return createCategory(createCategorySchema.parse(command.values));
    if (action === "update") {
      const values = createCategorySchema.parse(command.values);
      return updateRecord(TABLES.categories, { categoryId: id! }, { ...values, imageUrl: values.imageUrl, slug: slugify(values.name) });
    }
    const products = await scanAll<Product>(TABLES.products);
    if (products.some(item => item.categoryId === id)) throw new AppError("Move or remove this category’s products before deleting the category.", 409);
    await deleteRecord(TABLES.categories, { categoryId: id! });
  } else if (resource === "users") {
    if (action === "create") throw new AppError("Create users through the storefront.", 400);
    if (action === "update") return updateRecord(TABLES.users, { userId: id! }, { ...updateUserSchema.parse(command.values), updatedAt: new Date().toISOString() });
    const [cart, wishlist] = await Promise.all([scanAll<CartItem>(TABLES.cart), scanAll<WishlistItem>(TABLES.wishlist)]);
    if ([...cart, ...wishlist].some(item => item.userId === id)) throw new AppError("Remove this user’s cart and wishlist items before deleting the user.", 409);
    await deleteRecord(TABLES.users, { userId: id! });
  } else {
    if (action !== "delete" || !productId) throw new AppError("Only removal of a specific cart or wishlist item is supported.", 400);
    await deleteRecord(TABLES[resource], { userId: id!, productId });
  }
  return null;
}
