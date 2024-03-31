import { z } from "zod";

export const confirmModel = z.object({
  sub: z.string(),
  code: z.string().length(6, "Must be 6 characters long"),
});

export type ConfirmModel = z.infer<typeof confirmModel>;
