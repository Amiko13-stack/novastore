import { createHash, timingSafeEqual } from "node:crypto";
import { AppError } from "@/lib/http/api-error";

/** The key is configured on the server; callers supply it only over HTTPS. */
export function requireAdmin(request: Request): void {
  const expected = process.env.ADMIN_ACCESS_KEY;
  if (!expected || expected.length < 32) {
    throw new AppError("Live administration is not configured.", 503);
  }
  const supplied = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!supplied || !timingSafeEqual(digest(supplied), digest(expected))) {
    throw new AppError("Administrator access is required.", 401);
  }
}
