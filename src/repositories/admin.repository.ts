import { ScanCommand, DeleteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { documentClient } from "@/lib/db/dynamodb";
import { AppError } from "@/lib/http/api-error";

export async function scanAll<T>(table: string): Promise<T[]> {
  const items: T[] = [];
  let key: Record<string, unknown> | undefined;
  do {
    const response = await documentClient.send(new ScanCommand({ TableName: table, ExclusiveStartKey: key, ConsistentRead: true }));
    items.push(...((response.Items ?? []) as T[]));
    key = response.LastEvaluatedKey;
  } while (key);
  return items;
}

export async function deleteRecord(table: string, key: Record<string, string>) {
  const response = await documentClient.send(new DeleteCommand({ TableName: table, Key: key, ReturnValues: "ALL_OLD" }));
  if (!response.Attributes) throw new AppError("Record not found. Refresh the dashboard.", 404);
}

export async function updateRecord(table: string, key: Record<string, string>, values: Record<string, unknown>) {
  const entries = Object.entries(values).filter(([, value]) => value !== undefined);
  const removed = Object.entries(values).filter(([, value]) => value === undefined).map(([name]) => name);
  const names = Object.fromEntries(entries.map(([name], index) => ["#f" + index, name]));
  const parameters = Object.fromEntries(entries.map(([, value], index) => [":v" + index, value]));
  try {
    const response = await documentClient.send(new UpdateCommand({
      TableName: table, Key: key, UpdateExpression: "SET " + entries.map((_, index) => "#f" + index + " = :v" + index).join(", ") + (removed.length ? " REMOVE " + removed.map((_, index) => "#r" + index).join(", ") : ""),
      ExpressionAttributeNames: { ...names, ...Object.fromEntries(removed.map((name, index) => ["#r" + index, name])), "#pk": Object.keys(key)[0] },
      ExpressionAttributeValues: parameters, ConditionExpression: "attribute_exists(#pk)", ReturnValues: "ALL_NEW",
    }));
    return response.Attributes;
  } catch (error) {
    if (error instanceof Error && error.name === "ConditionalCheckFailedException") throw new AppError("Record not found. Refresh the dashboard.", 404);
    throw error;
  }
}
