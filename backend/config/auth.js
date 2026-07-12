const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("@better-auth/mongo-adapter");
const { getDB } = require("./db");

let authInstance;

function getAuth() {
  if (authInstance) return authInstance;

  const db = getDB();

  authInstance = betterAuth({
    database: mongodbAdapter(db),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      },
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: true,
          defaultValue: "supporter",
        },
        credits: {
          type: "number",
          required: true,
          defaultValue: 0,
        },
      },
    },
  });

  return authInstance;
}

module.exports = { getAuth };
