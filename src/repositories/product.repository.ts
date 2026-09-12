import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { documentClient } from "@/lib/db/dynamodb";
import { TABLES } from "@/lib/db/table-names";
import type { Product } from "@/types/entities";

export async function listProducts(categoryId?: string): Promise<Product[]> {
  if (categoryId) {
    const response = await documentClient.send(
      new QueryCommand({
        TableName: TABLES.products,
        IndexName: "categoryId-createdAt-index",
        KeyConditionExpression: "categoryId = :categoryId",
        ExpressionAttributeValues: {
          ":categoryId": categoryId,
        },
        ScanIndexForward: false,
      }),
    );

    return (response.Items ?? []) as Product[];
  }

  const response = await documentClient.send(
    new ScanCommand({
      TableName: TABLES.products,
    }),
  );

  return (response.Items ?? []) as Product[];
}

export async function getProductById(
  productId: string,
): Promise<Product | null> {
  const response = await documentClient.send(
    new GetCommand({
      TableName: TABLES.products,
      Key: { productId },
    }),
  );

  return (response.Item as Product | undefined) ?? null;
}

export async function putProduct(product: Product): Promise<void> {
  await documentClient.send(
    new PutCommand({
      TableName: TABLES.products,
      Item: product,
      ConditionExpression: "attribute_not_exists(productId)",
    }),
  );
}

export async function updateProductById(
  productId: string,
  updates: Partial<Omit<Product, "productId" | "createdAt">>,
): Promise<Product | null> {
  const entries = Object.entries(updates).filter(([, value]) => value !== undefined);

  if (entries.length === 0) {
    return getProductById(productId);
  }

  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, unknown> = {};
  const setExpressions: string[] = [];

  entries.forEach(([key, value], index) => {
    const nameKey = `#field${index}`;
    const valueKey = `:value${index}`;

    expressionAttributeNames[nameKey] = key;
    expressionAttributeValues[valueKey] = value;
    setExpressions.push(`${nameKey} = ${valueKey}`);
  });

  try {
    const response = await documentClient.send(
      new UpdateCommand({
        TableName: TABLES.products,
        Key: { productId },
        UpdateExpression: `SET ${setExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ConditionExpression: "attribute_exists(productId)",
        ReturnValues: "ALL_NEW",
      }),
    );

    return (response.Attributes as Product | undefined) ?? null;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      return null;
    }

    throw error;
  }
}

export async function deleteProductById(
  productId: string,
): Promise<Product | null> {
  const response = await documentClient.send(
    new DeleteCommand({
      TableName: TABLES.products,
      Key: { productId },
      ReturnValues: "ALL_OLD",
    }),
  );

  return (response.Attributes as Product | undefined) ?? null;
}
