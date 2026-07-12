require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { toNodeHandler, fromNodeHeaders } = require("better-auth/node");
const { connectDB, getDB } = require("./config/db");
const { getAuth } = require("./config/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.all("/api/auth/*splat", (req, res) => {
  const auth = getAuth();
  return toNodeHandler(auth)(req, res);
});

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "FundForge API is running" });
});

async function start() {
  try {
    await connectDB();
    getAuth();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    console.log("Server will start without database. Set MONGODB_URI in .env");
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
