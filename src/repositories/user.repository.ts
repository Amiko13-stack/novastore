import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { documentClient } from "@/lib/db/dynamodb";
import { TABLES } from "@/lib/db/table-names";
import type { User } from "@/types/entities";

export async function getUserById(userId: string): Promise<User | undefined> {
  const result = await documentClient.send(
    new GetCommand({
      TableName: TABLES.users,
      Key: { userId },
    }),
  );

  return result.Item as User | undefined;
}

export async function putUser(user: User): Promise<User> {
  await documentClient.send(
    new PutCommand({
      TableName: TABLES.users,
      Item: user,
    }),
  );

  return user;
}

export async function updateUser(
  userId: string,
  name: string,
  email: string,
  updatedAt: string,
): Promise<User | undefined> {
  const result = await documentClient.send(
    new UpdateCommand({
      TableName: TABLES.users,
      Key: { userId },
      UpdateExpression: "SET #name = :name, email = :email, updatedAt = :updatedAt",
      ConditionExpression: "attribute_exists(userId)",
      ExpressionAttributeNames: {
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":name": name,
        ":email": email,
        ":updatedAt": updatedAt,
      },
      ReturnValues: "ALL_NEW",
    }),
  );

  return result.Attributes as User | undefined;
}
