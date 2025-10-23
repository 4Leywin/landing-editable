import { ID, TablesDB } from "appwrite";
import { client } from "../client";

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const tablesDB = new TablesDB(client);
