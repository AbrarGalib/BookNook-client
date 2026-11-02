import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string); // Add MONGODB_URI to your Next.js .env too

export const auth = betterAuth({
  database: mongodbAdapter(client.db("bookNookDB")),
  emailAndPassword: { enabled: true },
});