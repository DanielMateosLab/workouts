import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const region = process.env.NEXT_PUBLIC_REGION;
if (!region) throw new Error("missing NEXT_PUBLIC_REGION");

export const cognitoClientId = process.env.USER_POOL_CLIENT_ID;
if (!cognitoClientId) throw new Error("missing USER_POOL_CLIENT_ID");

export const getCognitoClient = () =>
  new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_REGION,
  });
