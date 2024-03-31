import { z } from "zod";

export const resendCodeModel = z.object({ sub: z.string() });

export type ResendCodeModel = z.infer<typeof resendCodeModel>;
