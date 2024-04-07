export default class Env {
  private static envKeys = {
    domain: process.env.NEXT_PUBLIC_DOMAIN,
    appName: process.env.NEXT_PUBLIC_APP_NAME,
    region: process.env.NEXT_PUBLIC_REGION,
  };

  public static get(key: keyof typeof Env.envKeys) {
    const value = Env.envKeys[key];
    if (!value) throw new Error(`${Env.envKeys[key]} is not set.`);
    return value;
  }
}
