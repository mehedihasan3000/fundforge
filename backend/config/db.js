const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || "fundforge";
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
});
let db;

async function connectDB() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`MongoDB connected — database: ${dbName}`);
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err;
  }
}

function getDB() {
  if (!db) throw new Error("Database not initialized. Call connectDB first.");
  return db;
}

module.exports = { connectDB, getDB };
