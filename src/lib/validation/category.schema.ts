import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(500).optional(),
  imageUrl: z.string().url("imageUrl must be a valid URL").optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
