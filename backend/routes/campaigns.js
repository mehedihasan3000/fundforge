const express = require("express");
const { getDB } = require("../config/db");

const router = express.Router();

router.get("/top", async (req, res) => {
  try {
    const db = getDB();
    const campaigns = await db
      .collection("campaigns")
      .find({ status: "approved" })
      .sort({ amountRaised: -1 })
      .limit(6)
      .toArray();
    res.json(campaigns);
  } catch (err) {
    console.error("campaigns error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
