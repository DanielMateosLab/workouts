/// <reference path="./.sst/platform/config.d.ts" />

import * as aws from "@pulumi/aws";

const userPool = new aws.cognito.UserPool("WorkoutsUserPool", {
  accountRecoverySetting: {
    recoveryMechanisms: [{ name: "verified_email", priority: 1 }],
  },
  autoVerifiedAttributes: ["email"],
  usernameAttributes: ["email"],
});
const userPoolClient = new aws.cognito.UserPoolClient(
  "WorkoutsUserPoolClient",
  { userPoolId: userPool.id },
);

export default $config({
  app(input) {
    return {
      name: "workouts",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("MyWeb", {
      domain: {
        domainName: "workouts.danielmatlab.com",
        redirects: ["www.workouts.danielmatlab.com"],
        hostedZone: "danielmatlab.com",
      },
      environment: {
        NEXT_PUBLIC_USER_POOL_ID: userPool.id,
        NEXT_PUBLIC_USER_POOL_CLIENT_ID: userPoolClient.id,
        NEXT_PUBLIC_REGION: aws.config.requireRegion(),
      },
    });
  },
});
