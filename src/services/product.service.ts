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
