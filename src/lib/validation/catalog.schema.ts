import { z } from "zod";

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.string().trim().max(max).optional(),
  );

const optionalPrice = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.coerce.number().finite().min(0).max(100000).optional(),
);

export const catalogSortSchema = z.enum([
  "newest",
  "price-asc",
  "price-desc",
  "name-asc",
]);

export const catalogQuerySchema = z
  .object({
    q: optionalText(100),
    categoryId: optionalText(100),
    minPrice: optionalPrice,
    maxPrice: optionalPrice,
    sort: catalogSortSchema.default("newest"),
  })
  .superRefine((value, ctx) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.minPrice > value.maxPrice
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["minPrice"],
        message: "Minimum price cannot be greater than maximum price",
      });
    }
  });

export type CatalogQuery = z.infer<typeof catalogQuerySchema>;
