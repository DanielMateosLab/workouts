"use server";

import { signIn } from "@/use-cases/auth";
import { loginModel } from "@/domain/auth";

export const login = async (data: any) => {
  const { email } = loginModel.parse(data);
  await signIn("email", { email });
};
