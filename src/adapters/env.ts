import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AWS_REGION: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_APP_NAME: z.string().min(1),
  },
  runtimeEnv: {
    AWS_REGION: process.env.AWS_REGION,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
});

export const envAux = {
  DEFAULT_FROM_EMAIL: `no-reply@${env.NEXT_PUBLIC_DOMAIN}`,
};

/**
 * Implement this:
 * 
import { z } from "zod";
 
const envVariables = z.object({
  DATABASE_URL: z.string(),
  CUSTOM_STUFF: z.string(),
});
 
envVariables.parse(process.env);
 
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
 */
