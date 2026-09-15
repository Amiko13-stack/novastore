import { AppError } from "@/lib/http/api-error";
import type { UpdateUserInput } from "@/lib/validation/user.schema";
import { getUserById, putUser, updateUser } from "@/repositories/user.repository";
import type { User } from "@/types/entities";

export async function getOrCreateUser(userId: string): Promise<User> {
  const existing = await getUserById(userId);
  if (existing) return existing;

  const now = new Date().toISOString();

  return putUser({
    userId,
    name: "Nova Guest",
    email: "demo@novastore.local",
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateUserProfile(
  userId: string,
  input: UpdateUserInput,
): Promise<User> {
  await getOrCreateUser(userId);

  try {
    const updated = await updateUser(
      userId,
      input.name,
      input.email,
      new Date().toISOString(),
    );

    if (!updated) throw new AppError("User could not be updated", 500);
    return updated;
  } catch (error) {
    if (error instanceof Error && error.name === "ConditionalCheckFailedException") {
      throw new AppError("User not found", 404);
    }
    throw error;
  }
}
