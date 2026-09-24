import type { Product, Category, User, CartItem, WishlistItem } from "@/types/entities";

export type AdminData = {
  products: Product[]; categories: Category[]; users: User[];
  cart: CartItem[]; wishlist: WishlistItem[];
};
const date = "2026-09-01T09:00:00.000Z";
export const sampleData: AdminData = {
  categories: [
    { categoryId: "tech", name: "Technology", slug: "technology", createdAt: date },
    { categoryId: "home", name: "Home & living", slug: "home-living", createdAt: date },
    { categoryId: "style", name: "Everyday carry", slug: "everyday-carry", createdAt: date },
  ],
  products: [
    ["p1", "Studio headphones", "tech", 129, 24],
    ["p2", "Arc desk lamp", "home", 68, 7],
    ["p3", "Everyday tote", "style", 42, 38],
    ["p4", "Mechanical keyboard", "tech", 95, 0],
    ["p5", "Stoneware mug", "home", 24, 5],
    ["p6", "Pocket organiser", "style", 35, 18],
    ["p7", "Wireless speaker", "tech", 89, 12],
    ["p8", "Linen cushion", "home", 39, 20],
    ["p9", "Travel pouch", "style", 29, 3],
  ].map(([productId, name, categoryId, price, stock], index) => ({
    productId: String(productId), name: String(name), categoryId: String(categoryId),
    slug: String(name).toLowerCase().replaceAll(" ", "-"), price: Number(price),
    stock: Number(stock), description: "Sample product for exploring the NovaStore admin dashboard.",
    imageUrl: "https://example.com/sample-product.jpg", featured: index < 2,
    createdAt: date, updatedAt: date,
  })),
  users: [
    { userId: "u1", name: "Alex Morgan", email: "alex@example.com", createdAt: date, updatedAt: date },
    { userId: "u2", name: "Sam Rivera", email: "sam@example.com", createdAt: date, updatedAt: date },
    { userId: "u3", name: "Jordan Lee", email: "jordan@example.com", createdAt: date, updatedAt: date },
  ],
  cart: [
    { userId: "u1", productId: "p1", quantity: 1, addedAt: date, updatedAt: date },
    { userId: "u2", productId: "p3", quantity: 2, addedAt: date, updatedAt: date },
  ],
  wishlist: [
    { userId: "u1", productId: "p2", addedAt: date },
    { userId: "u3", productId: "p7", addedAt: date },
  ],
};
