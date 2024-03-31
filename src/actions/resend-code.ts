"use server";

import { cognitoClientId, getCognitoClient } from "@/lib/cognito";
import { resendCodeModel } from "@/models/resend-code";
import { ErrorResponse } from "@/types/error-response";
import { ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";
import "server-only";

type ResendCodeResponse = ErrorResponse | { status: "success" };

export const resendCode = async (
  data: unknown,
): Promise<ResendCodeResponse> => {
  try {
    const result = resendCodeModel.safeParse(data);
    if (!result.success)
      return {
        status: "invalidData",
        issues: result.error.issues.map((i) => ({
          path: i.path[0].toString(),
          message: i.message,
        })),
      };

    const { sub } = result.data;
    const client = getCognitoClient();
    const command = new ResendConfirmationCodeCommand({
      ClientId: cognitoClientId,
      Username: sub,
    });

    const res = await client.send(command);
    console.log(JSON.stringify(res, null, 2));
    return { status: "success" };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    return { status: "error" };
  }
};
