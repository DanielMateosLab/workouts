import { sesClient } from "@/lib/ses";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import NextAuth from "next-auth";

const domain = process.env.NEXT_PUBLIC_DOMAIN;
if (!domain) throw new Error("NEXT_PUBLIC_DOMAIN is not set.");

const from = `no-reply@${domain}`;

const handler = NextAuth({
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
                    Data: "HTML_FORMAT_BODY",
                  },
                  Text: {
                    Charset: "UTF-8",
                    Data: "TEXT_FORMAT_BODY",
                  },
                },
                Subject: {
                  Charset: "UTF-8",
                  Data: "EMAIL_SUBJECT",
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
});

export { handler as GET, handler as POST };
