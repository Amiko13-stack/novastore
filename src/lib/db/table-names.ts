import { env } from "@/lib/config/env";

export const TABLES = {
  users: env.usersTable(),
  products: env.productsTable(),
  categories: env.categoriesTable(),
  cart: env.cartTable(),
  wishlist: env.wishlistTable(),
};
