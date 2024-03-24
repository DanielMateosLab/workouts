/// <reference path="./.sst/platform/config.d.ts" />

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
    });
  },
});
