import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { env } from "@/lib/config/env";

export const dynamoDBClient = new DynamoDBClient({
  region: async () => env.awsRegion(),
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
});

export const documentClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});
