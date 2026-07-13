require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { toNodeHandler } = require("better-auth/node");
const { connectDB } = require("./config/db");
const { getAuth } = require("./config/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

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

  const campaignRoutes = require("./routes/campaigns");
  const statsRoutes = require("./routes/stats");
  const contributionRoutes = require("./routes/contributions");
  const withdrawalRoutes = require("./routes/withdrawals");
  const paymentRoutes = require("./routes/payments");
  const userRoutes = require("./routes/users");
  const reportRoutes = require("./routes/reports");
  const notificationRoutes = require("./routes/notifications");
  app.use("/api/campaigns", campaignRoutes);
  app.use("/api/stats", statsRoutes);
  app.use("/api/contributions", contributionRoutes);
  app.use("/api/withdrawals", withdrawalRoutes);
  app.use("/api/payments", paymentRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/notifications", notificationRoutes);

  app.all("/api/auth/*splat", (req, res, next) => {
    if (!req.path.startsWith("/api/auth/")) return next();
    try {
      const auth = getAuth();
      return toNodeHandler(auth)(req, res);
    } catch (err) {
      console.error("Auth handler error:", err.message);
      return res.status(500).json({ message: "Auth error" });
    }
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
