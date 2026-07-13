const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { notifyCampaignApproval, notifyCampaignRejection } = require("../utils/email");

async function getTopCampaigns(req, res) {
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
    res.status(500).json({ message: err.message });
  }
}

async function getCreatorCampaigns(req, res) {
  try {
    const db = getDB();
    const campaigns = await db
      .collection("campaigns")
      .find({ creatorEmail: req.user.email })
      .sort({ deadline: -1 })
      .toArray();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createCampaign(req, res) {
  try {
    const db = getDB();
    const { title, story, category, fundingGoal, minimumContribution, deadline, rewardInfo, imageUrl } = req.body;
    if (!title || !story || !category || !fundingGoal || !minimumContribution || !deadline) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const campaign = {
      title,
      story,
      category,
      fundingGoal: Number(fundingGoal),
      minimumContribution: Number(minimumContribution),
      deadline: new Date(deadline),
      rewardInfo: rewardInfo || "",
      imageUrl: imageUrl || "",
      creatorEmail: req.user.email,
      creatorName: req.user.name,
      amountRaised: 0,
      status: "pending",
      createdAt: new Date(),
    };
    const result = await db.collection("campaigns").insertOne(campaign);
    res.status(201).json({ ...campaign, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateCampaign(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const { title, story, rewardInfo } = req.body;
    const campaign = await db.collection("campaigns").findOne({ _id: new ObjectId(id), creatorEmail: req.user.email });
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    await db.collection("campaigns").updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, story, rewardInfo } }
    );
    res.json({ message: "Campaign updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteCampaign(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const campaign = await db.collection("campaigns").findOne({ _id: new ObjectId(id), creatorEmail: req.user.email });
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    const contributions = await db.collection("contributions").find({ campaignId: id, status: "approved" }).toArray();
    for (const c of contributions) {
      await db.collection("user").updateOne(
        { email: c.supporterEmail },
        { $inc: { credits: c.contributionAmount } }
      );
    }
    await db.collection("contributions").deleteMany({ campaignId: id });
    await db.collection("campaigns").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Campaign deleted, supporters refunded" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllCampaigns(req, res) {
  try {
    const db = getDB();
    const { category, status, search, deadline, minGoal, maxGoal } = req.query;
    const match = {};
    if (category) match.category = category;
    if (status) match.status = status;
    if (search) match.title = { $regex: search, $options: "i" };
    if (deadline === "active") match.deadline = { $gt: new Date() };
    if (deadline === "ended") match.deadline = { $lt: new Date() };
    if (minGoal || maxGoal) {
      match.fundingGoal = {};
      if (minGoal) match.fundingGoal.$gte = Number(minGoal);
      if (maxGoal) match.fundingGoal.$lte = Number(maxGoal);
    }
    const campaigns = await db.collection("campaigns").aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $addFields: {
        progress: {
          $cond: {
            if: { $gt: ["$fundingGoal", 0] },
            then: { $multiply: [{ $divide: ["$amountRaised", "$fundingGoal"] }, 100] },
            else: 0,
          },
        },
      }},
    ]).toArray();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCampaignById(req, res) {
  try {
    const db = getDB();
    const campaign = await db.collection("campaigns").findOne({ _id: new ObjectId(req.params.id) });
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function approveCampaign(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    await db.collection("campaigns").updateOne({ _id: new ObjectId(id) }, { $set: { status: "approved" } });
    const campaign = await db.collection("campaigns").findOne({ _id: new ObjectId(id) });
    await db.collection("notifications").insertOne({
      message: `Your campaign "${campaign.title}" has been approved by the admin`,
      toEmail: campaign.creatorEmail,
      actionRoute: "/dashboard/creator/my-campaigns",
      time: new Date(),
    });
    notifyCampaignApproval(campaign.creatorEmail, campaign.title).catch(() => {});
    res.json({ message: "Campaign approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function rejectCampaign(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    await db.collection("campaigns").updateOne({ _id: new ObjectId(id) }, { $set: { status: "rejected" } });
    const campaign = await db.collection("campaigns").findOne({ _id: new ObjectId(id) });
    await db.collection("notifications").insertOne({
      message: `Your campaign "${campaign.title}" has been rejected by the admin`,
      toEmail: campaign.creatorEmail,
      actionRoute: "/dashboard/creator/my-campaigns",
      time: new Date(),
    });
    notifyCampaignRejection(campaign.creatorEmail, campaign.title).catch(() => {});
    res.json({ message: "Campaign rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getTopCampaigns, getCreatorCampaigns, createCampaign, updateCampaign, deleteCampaign, getAllCampaigns, getCampaignById, approveCampaign, rejectCampaign };
