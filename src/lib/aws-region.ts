const AWS_REGION = process.env.NEXT_PUBLIC_REGION;
if (!AWS_REGION) {
  throw new Error("NEXT_PUBLIC_REGION is not set.");
}

export { AWS_REGION };
