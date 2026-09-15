import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { documentClient } from "@/lib/db/dynamodb";
import { TABLES } from "@/lib/db/table-names";
import type { WishlistItem } from "@/types/entities";

export async function listWishlistItems(userId: string): Promise<WishlistItem[]> {
  const result = await documentClient.send(
    new QueryCommand({
      TableName: TABLES.wishlist,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    }),
  );

  return (result.Items ?? []) as WishlistItem[];
}

export async function getWishlistItem(
  userId: string,
  productId: string,
): Promise<WishlistItem | undefined> {
  const result = await documentClient.send(
    new GetCommand({
      TableName: TABLES.wishlist,
      Key: { userId, productId },
    }),
  );

  return result.Item as WishlistItem | undefined;
}

export async function putWishlistItem(item: WishlistItem): Promise<WishlistItem> {
  await documentClient.send(
    new PutCommand({
      TableName: TABLES.wishlist,
      Item: item,
    }),
  );

  return item;
}

export async function deleteWishlistItem(
  userId: string,
  productId: string,
): Promise<WishlistItem | undefined> {
  const result = await documentClient.send(
    new DeleteCommand({
      TableName: TABLES.wishlist,
      Key: { userId, productId },
      ReturnValues: "ALL_OLD",
    }),
  );

  return result.Attributes as WishlistItem | undefined;
}
