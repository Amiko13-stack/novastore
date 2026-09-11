export interface User {
  userId: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Product {
  productId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  userId: string;
  productId: string;
  quantity: number;
  addedAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  userId: string;
  productId: string;
  addedAt: string;
}
