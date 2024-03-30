"use server";

import { signUpModel } from "@/models/signup";
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  UsernameExistsException,
} from "@aws-sdk/client-cognito-identity-provider";
import "server-only";

type SignUpResponse =
  | {
      status: "invalidData";
      issues: { path: string; message: string }[];
    }
  | {
      status: "success";
    }
  | {
      status: "error";
    };

export const signUp = async (data: unknown): Promise<SignUpResponse> => {
  try {
    const result = signUpModel.safeParse(data);
    if (!result.success)
      return {
        status: "invalidData",
        issues: result.error.issues.map((i) => ({
          path: i.path[0].toString(),
          message: i.message,
        })),
      };

    const { email, password } = result.data;
    const client = new CognitoIdentityProviderClient({
      region: process.env.NEXT_PUBLIC_REGION,
    });

    const command = new SignUpCommand({
      ClientId: process.env.USER_POOL_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    });

    const res = await client.send(command);
    console.log(JSON.stringify(res, null, 2));
    return { status: "success" };
  } catch (error) {
    if (error instanceof UsernameExistsException)
      return {
        status: "invalidData",
        issues: [
          {
            path: "email",
            message: "An account with the given email already exists.",
          },
        ],
      };
    return { status: "error" };
  }
};
