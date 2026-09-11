import { env } from "@/lib/config/env";

/**
 * Authentication is not part of the assignment requirements.
 * We keep user resolution behind one function so real authentication
 * can replace this later without changing cart/wishlist business logic.
 */
export function getCurrentUserId(): string {
  return env.demoUserId();
}
