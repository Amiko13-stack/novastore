import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { documentClient } from "@/lib/db/dynamodb";
import { TABLES } from "@/lib/db/table-names";
import type { CartItem } from "@/types/entities";

export async function listCartItems(userId: string): Promise<CartItem[]> {
  const result = await documentClient.send(
    new QueryCommand({
      TableName: TABLES.cart,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    }),
  );

  return (result.Items ?? []) as CartItem[];
}

export async function getCartItem(
  userId: string,
  productId: string,
): Promise<CartItem | undefined> {
  const result = await documentClient.send(
    new GetCommand({
      TableName: TABLES.cart,
      Key: { userId, productId },
    }),
  );

  return result.Item as CartItem | undefined;
}

export async function putCartItem(item: CartItem): Promise<CartItem> {
  await documentClient.send(
    new PutCommand({
      TableName: TABLES.cart,
      Item: item,
    }),
  );

  return item;
}

export async function updateCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number,
  updatedAt: string,
): Promise<CartItem | undefined> {
  const result = await documentClient.send(
    new UpdateCommand({
      TableName: TABLES.cart,
      Key: { userId, productId },
      UpdateExpression: "SET #quantity = :quantity, updatedAt = :updatedAt",
      ConditionExpression: "attribute_exists(userId) AND attribute_exists(productId)",
      ExpressionAttributeNames: {
        "#quantity": "quantity",
      },
      ExpressionAttributeValues: {
        ":quantity": quantity,
        ":updatedAt": updatedAt,
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return result.Attributes as CartItem | undefined;
}

export async function deleteCartItem(
  userId: string,
  productId: string,
): Promise<CartItem | undefined> {
  const result = await documentClient.send(
    new DeleteCommand({
      TableName: TABLES.cart,
      Key: { userId, productId },
      ReturnValues: "ALL_OLD",
    }),
  );

  return result.Attributes as CartItem | undefined;
}
