import "server-only";

import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { env } from "./env";

const region = env.AWS_REGION;
const domain = env.NEXT_PUBLIC_DOMAIN;

const sesClient = new SESClient({ region });

interface SendEmailArgs {
  to: string[];
  from?: "no-reply";
  subject: string;
  body: string;
}

export const sendEmail = async ({
  to,
  from = "no-reply",
  subject,
  body,
}: SendEmailArgs) => {
  await sesClient.send(
    new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: body,
          },
        },
      },
      Source: `${from}@${domain}`,
      ReplyToAddresses: [],
    }),
  );
};
