function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  awsRegion: () => required("AWS_REGION"),
  usersTable: () => required("DYNAMODB_USERS_TABLE"),
  productsTable: () => required("DYNAMODB_PRODUCTS_TABLE"),
  categoriesTable: () => required("DYNAMODB_CATEGORIES_TABLE"),
  cartTable: () => required("DYNAMODB_CART_TABLE"),
  wishlistTable: () => required("DYNAMODB_WISHLIST_TABLE"),
  demoUserId: () => process.env.DEMO_USER_ID ?? "demo-user-1",
};
