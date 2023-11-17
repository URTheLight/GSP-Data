// server.js
import cors from "cors";
import express from "express";
import mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;
const app = express();
const port = 3001; // Ensure this port is different from the React app's port

// Connection URL
const url =
  "mongodb://username:password@localhost:27017/?authMechanism=DEFAULT";
const client = new MongoClient(url);

// Database Name
const dbName = "New";

// Use cors middleware to handle cross-origin requests
app.use(cors());

// Connect to MongoDB once when the server starts
let db;

async function startDatabase() {
  await client.connect();
  db = client.db(dbName);
  console.log("Connected correctly to MongoDB server");
}

// Start the database and then the server
startDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});

// Reuse the same db connection across requests
app.get("/data", async (req, res) => {
  try {
    const collection = db.collection("coded");
    // Find some documents
    const docs = await collection.find({}).toArray();
    res.status(200).json(docs);
  } catch (err) {
    console.error("Failed to retrieve data", err);
    res.status(500).json({ error: err.message });
  }
});

// Properly handle close event
process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
