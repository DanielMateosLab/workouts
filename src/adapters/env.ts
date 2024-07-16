import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AWS_REGION: z.string().min(1),
    // Activates local dev mode (local DynamoDB and SES)
    LOCAL_DEV: z.boolean().optional().default(false),
    DYNAMODB_ENDPOINT: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
  },
  runtimeEnv: {
    AWS_REGION: process.env.AWS_REGION,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT,
    LOCAL_DEV: process.env.LOCAL_DEV,
  },
});

export const envAux = {
  DEFAULT_FROM_EMAIL: `no-reply@${env.NEXT_PUBLIC_DOMAIN}`,
};
