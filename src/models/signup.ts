import { z } from "zod";

export const signUpModel = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Must be at least 8 characters long")
      .regex(/[a-z]/, "Must contain at least 1 lowercase letter")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(
        /[$^*.\[\]{}()?\-"!@#%&\\/,<>':;|_~`+=]+/,
        "Must contain at least 1 special character",
      ),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords do not match",
  });

export type SignUpModel = z.infer<typeof signUpModel>;
