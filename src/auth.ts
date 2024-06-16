import { sesClient } from "@/lib/ses";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import NextAuth from "next-auth";
import Env from "./lib/env";
import { Resource } from "sst";

const domain = Env.get("domain");
const appName = Env.get("appName");
const region = Env.get("region");

const from = `no-reply@${domain}`;

const db = new DynamoDB({ region });
const client = DynamoDBDocument.from(db, {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});
const adapter = DynamoDBAdapter(client, {
  tableName: Resource.AuthTable.tableName,
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    verifyRequest: "/auth/link-sent",
    error: "/auth/error",
  },
  providers: [
    {
      name: "Email",
      id: "email",
      type: "email",
      from,
      maxAge: 60 * 60 * 24,
      options: {},
      server: {},
      sendVerificationRequest: async ({ identifier: email, url }) => {
        try {
          await sesClient.send(
            new SendEmailCommand({
              Destination: {
                CcAddresses: [],
                ToAddresses: [email],
              },
              Message: {
                Body: {
                  Html: {
                    Charset: "UTF-8",
                    Data: `Here is your <a href="${url}">login link</a>.`,
                  },
                },
                Subject: {
                  Charset: "UTF-8",
                  Data: `Login to ${appName}`,
                },
              },
              Source: from,
              ReplyToAddresses: [],
            }),
          );
        } catch (e) {
          console.error(e);
          throw new Error("Failed to send email.");
        }
      },
    },
  ],
  adapter,
});
