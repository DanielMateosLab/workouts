import { sesClient } from "@/lib/ses";
import { DynamoDBAdapter } from "@auth/dynamodb-adapter";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import NextAuth from "next-auth";
import Env from "./src/lib/env";

const domain = Env.get("domain");
const appName = Env.get("appName");
const region = Env.get("region");

const from = `no-reply@${domain}`;

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
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
                  // Html: {
                  //   Charset: "UTF-8",
                  //   Data: `Here is your <a href="${url}">login link</a>.`,
                  // },
                  Text: {
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
  adapter: DynamoDBAdapter(
    DynamoDBDocument.from(new DynamoDB({ region }), {
      marshallOptions: {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
      },
    }),
    { tableName: process.env.TABLE_NAME },
  ),
  pages: {
    signIn: "/login",
  },
});
