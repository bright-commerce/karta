import { Cashfree, CFEnvironment } from "cashfree-pg";

const isProd = process.env.CASHFREE_ENV === "PRODUCTION";

const environment = isProd 
  ? CFEnvironment.PRODUCTION 
  : CFEnvironment.SANDBOX;

const clientId = isProd 
  ? (process.env.CASHFREE_APP_ID || "") 
  : (process.env.CASHFREE_TEST_APP_ID || "");

const clientSecret = isProd 
  ? (process.env.CASHFREE_SECRET_KEY || "") 
  : (process.env.CASHFREE_TEST_SECRET_KEY || "");

const cashfree = new Cashfree(environment, clientId, clientSecret);

export { cashfree as Cashfree };
