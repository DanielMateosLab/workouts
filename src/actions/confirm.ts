"use server";

import "server-only";
import { cognitoClientId, getCognitoClient } from "@/lib/cognito";
import { confirmModel } from "@/models/confirm";
import { ErrorResponse } from "@/types/error-response";
import {
  CodeMismatchException,
  ConfirmSignUpCommand,
  ExpiredCodeException,
} from "@aws-sdk/client-cognito-identity-provider";

type ConfirmResponse = ErrorResponse | { status: "success" };

export const confirmSignup = async (
  data: unknown,
): Promise<ConfirmResponse> => {
  try {
    const result = confirmModel.safeParse(data);
    if (!result.success)
      return {
        status: "invalidData",
        issues: result.error.issues.map((i) => ({
          path: i.path[0].toString(),
          message: i.message,
        })),
      };

    const { sub, code } = result.data;
    const client = getCognitoClient();
    const command = new ConfirmSignUpCommand({
      ClientId: cognitoClientId,
      Username: sub,
      ConfirmationCode: code,
    });

    const res = await client.send(command);
    console.log(JSON.stringify(res, null, 2));
    return { status: "success" };
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    if (error instanceof CodeMismatchException)
      return {
        status: "invalidData",
        issues: [{ path: "code", message: "Wrong confirmation code." }],
      };
    if (error instanceof ExpiredCodeException)
      return {
        status: "invalidData",
        issues: [{ path: "code", message: "Confirmation code expired." }],
      };
    return { status: "error" };
  }
};
