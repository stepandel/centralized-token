import { Collection, Document, MongoClient } from "mongodb";


const MONGODB_URL = "mongodb://127.0.0.1:27017"

let client: MongoClient | null;

export const getClient = async () => {
  if (!client) {
    const mClient = new MongoClient(MONGODB_URL);
    console.log("Connecting to DB...")
    try {
      client = await mClient.connect();
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log("Using existing MongoDB connection");
  }

  return client;
}

export enum Table {
  Accounts =  "accounts",
}

export const getTable = async (tableName: Table): Promise<Collection<Document>> => {
  if (!client) {
    client = await getClient();
  }
  return client?.db("ledn").collection(tableName)!;
}