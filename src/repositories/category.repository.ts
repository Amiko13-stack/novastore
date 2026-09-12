import { GetCommand, PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { documentClient } from "@/lib/db/dynamodb";
import { TABLES } from "@/lib/db/table-names";
import type { Category } from "@/types/entities";

export async function listCategories(): Promise<Category[]> {
  const response = await documentClient.send(
    new ScanCommand({
      TableName: TABLES.categories,
    }),
  );

  return (response.Items ?? []) as Category[];
}

export async function getCategoryById(
  categoryId: string,
): Promise<Category | null> {
  const response = await documentClient.send(
    new GetCommand({
      TableName: TABLES.categories,
      Key: { categoryId },
    }),
  );

  return (response.Item as Category | undefined) ?? null;
}

export async function putCategory(category: Category): Promise<void> {
  await documentClient.send(
    new PutCommand({
      TableName: TABLES.categories,
      Item: category,
    }),
  );
}
