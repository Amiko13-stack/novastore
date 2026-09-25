import { AppError } from "@/lib/http/api-error";
import { env } from "@/lib/config/env";

/**
 * Authentication is not part of the assignment requirements.
 * We keep user resolution behind one function so real authentication
 * can replace this later without changing cart/wishlist business logic.
 */
export function getCurrentUserId(): string {
  if (process.env.ADMIN_ONLY_MODE === "true") {
    throw new AppError("Customer sign-in is unavailable on this administration site.", 403);
  }
  return env.demoUserId();
}
