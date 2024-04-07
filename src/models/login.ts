import { z } from "zod";

export const loginModel = z.object({
  email: z.string().email(),
});

export type LoginModel = z.infer<typeof loginModel>;
