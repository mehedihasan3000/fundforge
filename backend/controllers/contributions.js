const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function createContribution(req, res) {
  try {
    const db = getDB();
    const { campaignId, campaignTitle, contributionAmount, creatorName, creatorEmail } = req.body;
    if (!campaignId || !contributionAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const supporter = await db.collection("users").findOne({ email: req.user.email });
    if (!supporter || supporter.credits < contributionAmount) {
      return res.status(400).json({ message: "Insufficient credits" });
    }
    await db.collection("users").updateOne(
      { email: req.user.email },
      { $inc: { credits: -contributionAmount } }
    );
    const contribution = {
      campaignId,
      campaignTitle: campaignTitle || "",
      contributionAmount: Number(contributionAmount),
      supporterEmail: req.user.email,
      supporterName: req.user.name,
      creatorName: creatorName || "",
      creatorEmail: creatorEmail || "",
      date: new Date(),
      status: "pending",
    };
    const result = await db.collection("contributions").insertOne(contribution);
    await db.collection("notifications").insertOne({
      message: `${req.user.name} contributed ${contributionAmount} credits to "${campaignTitle}"`,
      toEmail: creatorEmail,
      actionRoute: "/dashboard/creator/home",
      time: new Date(),
    });
    res.status(201).json({ ...contribution, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getPendingContributions(req, res) {
  try {
    const db = getDB();
    const contributions = await db
      .collection("contributions")
      .find({ creatorEmail: req.user.email, status: "pending" })
      .sort({ date: -1 })
      .toArray();
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function approveContribution(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const contribution = await db.collection("contributions").findOne({ _id: new ObjectId(id) });
    if (!contribution) return res.status(404).json({ message: "Contribution not found" });
    await db.collection("contributions").updateOne({ _id: new ObjectId(id) }, { $set: { status: "approved" } });
    await db.collection("campaigns").updateOne(
      { _id: new ObjectId(contribution.campaignId) },
      { $inc: { amountRaised: contribution.contributionAmount } }
    );
    await db.collection("notifications").insertOne({
      message: `Your contribution of ${contribution.contributionAmount} credits to "${contribution.campaignTitle}" was approved by ${req.user.name}`,
      toEmail: contribution.supporterEmail,
      actionRoute: "/dashboard/supporter/contributions",
      time: new Date(),
    });
    res.json({ message: "Contribution approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function rejectContribution(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const contribution = await db.collection("contributions").findOne({ _id: new ObjectId(id) });
    if (!contribution) return res.status(404).json({ message: "Contribution not found" });
    await db.collection("contributions").updateOne({ _id: new ObjectId(id) }, { $set: { status: "rejected" } });
    await db.collection("users").updateOne(
      { email: contribution.supporterEmail },
      { $inc: { credits: contribution.contributionAmount } }
    );
    await db.collection("notifications").insertOne({
      message: `Your contribution of ${contribution.contributionAmount} credits to "${contribution.campaignTitle}" was rejected by ${req.user.name}`,
      toEmail: contribution.supporterEmail,
      actionRoute: "/dashboard/supporter/contributions",
      time: new Date(),
    });
    res.json({ message: "Contribution rejected, credits refunded" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUserContributions(req, res) {
  try {
    const db = getDB();
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await db.collection("contributions").countDocuments({ supporterEmail: req.user.email });
    const contributions = await db
      .collection("contributions")
      .find({ supporterEmail: req.user.email })
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    res.json({ contributions, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getUserApprovedContributions(req, res) {
  try {
    const db = getDB();
    const contributions = await db
      .collection("contributions")
      .find({ supporterEmail: req.user.email, status: "approved" })
      .sort({ date: -1 })
      .toArray();
    res.json(contributions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createContribution, getPendingContributions, approveContribution, rejectContribution, getUserContributions, getUserApprovedContributions };
