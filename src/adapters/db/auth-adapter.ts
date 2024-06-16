import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { env } from "@/adapters/env";

const region = env.AWS_REGION;

const db = new DynamoDB({ region });

const client = DynamoDBDocument.from(db, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export const authDbAdapter = DynamoDBAdapter(client, {
  tableName: Resource.AuthTable.tableName,
});
