"use server";

import { signIn } from "@/auth";
import { loginModel } from "@/models/login";

export const login = async (data: any) => {
  const { email } = loginModel.parse(data);
  await signIn("email", { email });
};
