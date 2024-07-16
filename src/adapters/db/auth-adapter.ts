import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";
import { env } from "@/adapters/env";

const dbConfig: DynamoDBClientConfig = {
  region: env.AWS_REGION,
};
if (env.LOCAL_DEV) dbConfig.endpoint = env.DYNAMODB_ENDPOINT;

const db = new DynamoDB(dbConfig);

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
