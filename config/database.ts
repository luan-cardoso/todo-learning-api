import 'dotenv/config';
import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME;

let db: Db;
let client: MongoClient;

export const connectDatabase = async (): Promise<Db> => {
    if (db) return db;
  
    try {
      client = new MongoClient(MONGO_URI);
      await client.connect();
      db = client.db(DB_NAME);
      console.log('✅ MongoDB conectado!');
      return db;
    } catch (error) {
      console.error('❌ Erro ao conectar MongoDB:', error);
      process.exit(1);
    }
  };

  export const getDatabase = (): Db => {
    if (!db) {
      throw new Error('Database não foi inicializado. Chame connectDatabase() primeiro.');
    }
    return db;
  };