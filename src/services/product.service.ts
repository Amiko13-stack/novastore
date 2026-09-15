import { randomUUID } from "node:crypto";
import { AppError } from "@/lib/http/api-error";
import type {
  CreateProductInput,
  UpdateProductInput,
} from "@/lib/validation/product.schema";
import { getCategoryById } from "@/repositories/category.repository";
import {
  deleteProductById,
  getProductById,
  listProducts,
  putProduct,
  updateProductById,
} from "@/repositories/product.repository";
import type { Product } from "@/types/entities";
import { slugify } from "@/utils/slugify";

export async function getProducts(categoryId?: string): Promise<Product[]> {
  return listProducts(categoryId);
}

export async function getProduct(productId: string): Promise<Product> {
  const product = await getProductById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const category = await getCategoryById(input.categoryId);

  if (!category) {
    throw new AppError("The selected category does not exist", 400);
  }

  const now = new Date().toISOString();

  const product: Product = {
    productId: randomUUID(),
    categoryId: input.categoryId,
    name: input.name,
    slug: slugify(input.name),
    description: input.description,
    price: input.price,
    imageUrl: input.imageUrl,
    stock: input.stock,
    featured: input.featured,
    createdAt: now,
    updatedAt: now,
  };

  await putProduct(product);
  return product;
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput,
): Promise<Product> {
  if (input.categoryId) {
    const category = await getCategoryById(input.categoryId);

    if (!category) {
      throw new AppError("The selected category does not exist", 400);
    }
  }

  const updates: Partial<Omit<Product, "productId" | "createdAt">> = {
    ...input,
    updatedAt: new Date().toISOString(),
  };

  if (input.name) {
    updates.slug = slugify(input.name);
  }

  const product = await updateProductById(productId, updates);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
}

export async function deleteProduct(productId: string): Promise<Product> {
  const product = await deleteProductById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
}

export type CatalogFilters = {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "name-asc";
};

export async function searchProducts(
  filters: CatalogFilters = {},
): Promise<Product[]> {
  const products = await listProducts(filters.categoryId);
  const query = filters.q?.trim().toLocaleLowerCase();

  const filtered = products.filter((product) => {
    const matchesQuery = query
      ? `${product.name} ${product.description} ${product.slug}`
          .toLocaleLowerCase()
          .includes(query)
      : true;

    const matchesMinimum =
      filters.minPrice === undefined || product.price >= filters.minPrice;
    const matchesMaximum =
      filters.maxPrice === undefined || product.price <= filters.maxPrice;

    return matchesQuery && matchesMinimum && matchesMaximum;
  });

  const sort = filters.sort ?? "newest";

  return [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "newest":
      default:
        return b.createdAt.localeCompare(a.createdAt);
    }
  });
}
