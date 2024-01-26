// server.js
import cors from "cors";
import express from "express";
import mongodb from "mongodb";

const MongoClient = mongodb.MongoClient;
const app = express();
const port = 3001; // Ensure this port is different from the React app's port

// Connection URL for MongoDB Atlas
const url =
  "mongodb+srv://ArrighiCenter:vV7vyKe9gZzPgRJ3@gsp.jkwip3p.mongodb.net/";

// Ensure you handle your credentials securely
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database Name
const dbName = "Nov2023";

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
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
});

// Reuse the same db connection across requests
app.get("/data", async (req, res) => {
  try {
    const collection = db.collection("TruePositive"); // Updated collection name
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
