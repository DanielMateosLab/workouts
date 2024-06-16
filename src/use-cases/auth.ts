import { sendEmail } from "@/adapters/ses-adapter";
import NextAuth from "next-auth";
import { authDbAdapter } from "@/adapters/db/auth-adapter";
import { envAux, env } from "@/adapters/env";

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
      from: envAux.DEFAULT_FROM_EMAIL,
      maxAge: 60 * 60 * 24,
      options: {},
      sendVerificationRequest: async ({ identifier: email, url }) =>
        sendEmail({
          to: [email],
          subject: `Sign in to ${env.NEXT_PUBLIC_APP_NAME}`,
          body: `Here is your <a href="${url}">login link</a>.`,
        }),
    },
  ],
  adapter: authDbAdapter,
});
