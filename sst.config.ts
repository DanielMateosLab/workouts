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

    const authTable = new aws.dynamodb.Table("AuthTable", {
      attributes: [
        { name: "pk", type: "S" },
        { name: "sk", type: "S" },
        { name: "GSI1PK", type: "S" },
        { name: "GSI1SK", type: "S" },
        // { name: "expires", type: "N" },
      ],
      billingMode: "PAY_PER_REQUEST",
      globalSecondaryIndexes: [
        {
          hashKey: "GSI1PK",
          name: "GSI1",
          projectionType: "ALL",
          rangeKey: "GSI1SK",
        },
      ],
      hashKey: "pk",
      rangeKey: "sk",
      // ttl: { attributeName: "expires", enabled: true },
    });

    const authTableActions = [
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem",
      "dynamodb:Describe*",
      "dynamodb:List*",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:Query",
      "dynamodb:UpdateItem",
    ];
    const authTablePolicy = new aws.iam.Policy("AuthTablePolicy", {
      description: "Policy for the AuthTable",
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "DynamoDBAccess",
            Effect: "Allow",
            Action: authTableActions,
            Resource: ["*"],
          },
        ],
      }),
    });

    const authSecret = new sst.Secret("AuthSecret");

    new sst.aws.Nextjs("MyWeb", {
      domain: {
        domainName: `${subdomain}.${domain}`,
        redirects: [`www.${subdomain}.${domain}`],
        hostedZone: domain,
      },
      environment: {
        NEXT_PUBLIC_APP_NAME: $app.name,
        NEXT_PUBLIC_DOMAIN: domain,
        NEXT_PUBLIC_REGION: aws.config.requireRegion(),
        AUTH_SECRET: authSecret.value,
      },
      permissions: [
        // TODO: test this policy is restricting access, test table policy
        {
          actions: ["ses:SendEmail", "ses:SendRawEmail"],
          resources: [sesLoginCodeSendingPolicy.arn],
        },
      ],
      link: [authTable],
    });
  },
});
