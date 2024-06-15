"use server";
import { signIn } from "@/auth";

export const login = async ({ email }: { email: string }) => {
  const result = await signIn("email", { email });
  console.log(result);
  return result;
};
