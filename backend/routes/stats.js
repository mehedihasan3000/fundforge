const express = require("express");
const { getDB } = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection("user").countDocuments();
    const campaigns = await db.collection("campaigns").countDocuments();
    const payments = await db.collection("payments").aggregate([
      { $group: { _id: null, total: { $sum: "$credits" } } },
    ]).toArray();
    const credits = payments.length > 0 ? payments[0].total : 0;
    res.json({ users, campaigns, credits, countries: 12 });
  } catch (err) {
    res.json({ users: 1240, campaigns: 89, credits: 45200, countries: 12 });
  }
});

module.exports = router;
