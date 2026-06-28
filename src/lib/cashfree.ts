import { Cashfree } from "cashfree-pg";

const isProd = process.env.CASHFREE_ENV === "PRODUCTION";

Cashfree.XClientId = isProd 
  ? (process.env.CASHFREE_APP_ID || "") 
  : (process.env.CASHFREE_TEST_APP_ID || "");

Cashfree.XClientSecret = isProd 
  ? (process.env.CASHFREE_SECRET_KEY || "") 
  : (process.env.CASHFREE_TEST_SECRET_KEY || "");

Cashfree.XEnvironment = isProd 
  ? Cashfree.Environment.PRODUCTION 
  : Cashfree.Environment.SANDBOX;

export { Cashfree };
