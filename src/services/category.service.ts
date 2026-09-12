import { randomUUID } from "node:crypto";
import {
  getCategoryById,
  listCategories,
  putCategory,
} from "@/repositories/category.repository";
import type { Category } from "@/types/entities";
import type { CreateCategoryInput } from "@/lib/validation/category.schema";
import { slugify } from "@/utils/slugify";
import { AppError } from "@/lib/http/api-error";

export async function getCategories(): Promise<Category[]> {
  return listCategories();
}

export async function getCategory(categoryId: string): Promise<Category> {
  const category = await getCategoryById(categoryId);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category;
}

export async function createCategory(
  input: CreateCategoryInput,
): Promise<Category> {
  const category: Category = {
    categoryId: randomUUID(),
    name: input.name,
    slug: slugify(input.name),
    description: input.description,
    imageUrl: input.imageUrl,
    createdAt: new Date().toISOString(),
  };

  await putCategory(category);
  return category;
}
