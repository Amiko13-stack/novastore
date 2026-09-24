import { env } from "@/lib/config/env";

export const TABLES = {
  get users() { return env.usersTable(); },
  get products() { return env.productsTable(); },
  get categories() { return env.categoriesTable(); },
  get cart() { return env.cartTable(); },
  get wishlist() { return env.wishlistTable(); },
};
