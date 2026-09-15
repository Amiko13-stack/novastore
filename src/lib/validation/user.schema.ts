import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Enter a valid email address").max(160),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
