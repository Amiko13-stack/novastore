import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { dynamoDBClient } from "@/lib/db/dynamodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await dynamoDBClient.send(new ListTablesCommand({ Limit: 20 }));

    return Response.json({
      success: true,
      database: "connected",
      tables: result.TableNames ?? [],
    });
  } catch (error) {
    console.error("DynamoDB health check failed", error);

    return Response.json(
      {
        success: false,
        database: "disconnected",
        message: "Could not connect to DynamoDB. Check AWS credentials and region.",
      },
      { status: 500 },
    );
  }
}
