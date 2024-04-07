/// <reference path="./.sst/platform/config.d.ts" />

import * as aws from "@pulumi/aws";

export default $config({
  app(input) {
    return {
      name: "workouts",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
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

    const domain = "danielmatlab.com";
    const subdomainPostfix =
      $app.stage === "production" ? "" : `-${$app.stage}`;
    const subdomain = `${$app.name}${subdomainPostfix}`;

    const sesLoginCodeSendingPolicy = new aws.iam.Policy(
      "WorkoutsSesLoginCodeSendingPolicy",
      {
        description: "Restrictive policy for sending login codes via SES",
        policy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["ses:SendEmail", "ses:SendRawEmail"],
              Resource: "*",
              Condition: {
                StringEquals: {
                  "ses:FromAddress": `no-reply@${domain}`,
                },
              },
            },
          ],
        }),
      },
    );

    new sst.aws.Nextjs("MyWeb", {
      domain: {
        domainName: `${subdomain}.${domain}`,
        redirects: [`www.${subdomain}.${domain}`],
        hostedZone: domain,
      },
      environment: {
        NEXT_PUBLIC_DOMAIN: domain,
        USER_POOL_ID: userPool.id,
        USER_POOL_CLIENT_ID: userPoolClient.id,
        NEXT_PUBLIC_REGION: aws.config.requireRegion(),
      },
      permissions: [
        {
          actions: ["ses:SendEmail", "ses:SendRawEmail"],
          resources: [sesLoginCodeSendingPolicy.arn],
        },
      ],
    });
  },
});
