import { Client, Account, Databases } from "appwrite";

// Ensure env vars are strings (provide empty fallback to satisfy typings).
const APPWRITE_ENDPOINT: string =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "";
const APPWRITE_PROJECT_ID: string =
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
