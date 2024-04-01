import "server-only";
import { SESClient } from "@aws-sdk/client-ses";
import { AWS_REGION } from "./aws-region";

const sesClient = new SESClient({ region: AWS_REGION });
export { sesClient };
