const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function createReport(req, res) {
  try {
    const db = getDB();
    const { campaignId, campaignTitle, reason } = req.body;
    if (!campaignId || !reason) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const report = {
      supporterEmail: req.user.email,
      supporterName: req.user.name,
      campaignId,
      campaignTitle,
      reason,
      date: new Date(),
    };
    const result = await db.collection("reports").insertOne(report);
    res.status(201).json({ ...report, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllReports(req, res) {
  try {
    const db = getDB();
    const reports = await db.collection("reports").find({}).sort({ date: -1 }).toArray();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteReport(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    await db.collection("reports").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createReport, getAllReports, deleteReport };
