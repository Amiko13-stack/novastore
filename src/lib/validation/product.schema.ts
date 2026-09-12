import { z } from "zod";

const productFields = {
  categoryId: z.string().min(1, "categoryId is required"),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(2000),
  price: z.number().positive("price must be greater than 0"),
  imageUrl: z.string().url("imageUrl must be a valid URL"),
  stock: z.number().int().min(0, "stock cannot be negative"),
  featured: z.boolean(),
};

export const createProductSchema = z.object({
  ...productFields,
  featured: productFields.featured.optional().default(false),
});

export const updateProductSchema = z
  .object(productFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
