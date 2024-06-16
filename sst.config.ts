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
        AWS_REGION: aws.config.requireRegion(),
        AUTH_SECRET: authSecret.value,
      },
      permissions: [],
      link: [authTable],
    });
  },
});
