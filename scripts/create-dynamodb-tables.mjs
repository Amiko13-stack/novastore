import dotenv from "dotenv";
import {
  CreateTableCommand,
  DescribeTableCommand,
  DynamoDBClient,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";

dotenv.config({ path: ".env.local" });

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in .env.local`);
  return value;
};

const client = new DynamoDBClient({ region: required("AWS_REGION") });

const tables = [
  {
    TableName: required("DYNAMODB_USERS_TABLE"),
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }],
  },
  {
    TableName: required("DYNAMODB_CATEGORIES_TABLE"),
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [{ AttributeName: "categoryId", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "categoryId", KeyType: "HASH" }],
  },
  {
    TableName: required("DYNAMODB_PRODUCTS_TABLE"),
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
      { AttributeName: "productId", AttributeType: "S" },
      { AttributeName: "categoryId", AttributeType: "S" },
      { AttributeName: "createdAt", AttributeType: "S" },
    ],
    KeySchema: [{ AttributeName: "productId", KeyType: "HASH" }],
    GlobalSecondaryIndexes: [
      {
        IndexName: "categoryId-createdAt-index",
        KeySchema: [
          { AttributeName: "categoryId", KeyType: "HASH" },
          { AttributeName: "createdAt", KeyType: "RANGE" },
        ],
        Projection: { ProjectionType: "ALL" },
      },
    ],
  },
  {
    TableName: required("DYNAMODB_CART_TABLE"),
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "productId", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
      { AttributeName: "productId", KeyType: "RANGE" },
    ],
  },
  {
    TableName: required("DYNAMODB_WISHLIST_TABLE"),
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [
      { AttributeName: "userId", AttributeType: "S" },
      { AttributeName: "productId", AttributeType: "S" },
    ],
    KeySchema: [
      { AttributeName: "userId", KeyType: "HASH" },
      { AttributeName: "productId", KeyType: "RANGE" },
    ],
  },
];

async function exists(tableName) {
  try {
    await client.send(new DescribeTableCommand({ TableName: tableName }));
    return true;
  } catch (error) {
    if (error?.name === "ResourceNotFoundException") return false;
    throw error;
  }
}

for (const table of tables) {
  if (await exists(table.TableName)) {
    console.log(`✓ ${table.TableName} already exists`);
    continue;
  }

  console.log(`Creating ${table.TableName}...`);
  await client.send(new CreateTableCommand(table));
  await waitUntilTableExists(
    { client, maxWaitTime: 120 },
    { TableName: table.TableName },
  );
  console.log(`✓ ${table.TableName} created`);
}

console.log("\nAll DynamoDB tables are ready.");
