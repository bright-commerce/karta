import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.R2_ACCOUNT_ID) {
  console.warn("R2_ACCOUNT_ID is not set.");
}

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export const R2_DOWNLOAD_BUCKET_NAME = process.env.R2_DOWNLOAD_BUCKET_NAME || process.env.R2_BUCKET_NAME || "";
export const R2_ASSETS_BUCKET_NAME = process.env.R2_ASSETS_BUCKET_NAME || "";
export const R2_ASSETS_PUBLIC_URL = process.env.R2_ASSETS_PUBLIC_URL || "https://your-public-r2-url.com";
