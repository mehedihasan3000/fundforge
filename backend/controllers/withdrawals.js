const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { notifyWithdrawalProcessed } = require("../utils/email");

async function createWithdrawal(req, res) {
  try {
    const db = getDB();
    const { withdrawalCredit, paymentSystem, accountNumber } = req.body;
    if (!withdrawalCredit || !paymentSystem || !accountNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    if (withdrawalCredit < 200) {
      return res.status(400).json({ message: "Minimum 200 credits required to withdraw" });
    }
    const user = await db.collection("user").findOne({ email: req.user.email });
    if (!user || user.credits < withdrawalCredit) {
      return res.status(400).json({ message: "Insufficient credits" });
    }
    const withdrawalAmount = withdrawalCredit / 20;
    const withdrawal = {
      creatorEmail: req.user.email,
      creatorName: req.user.name,
      withdrawalCredit: Number(withdrawalCredit),
      withdrawalAmount,
      paymentSystem,
      accountNumber,
      withdrawDate: new Date(),
      status: "pending",
    };
    const result = await db.collection("withdrawals").insertOne(withdrawal);
    res.status(201).json({ ...withdrawal, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCreatorWithdrawals(req, res) {
  try {
    const db = getDB();
    const withdrawals = await db
      .collection("withdrawals")
      .find({ creatorEmail: req.user.email })
      .sort({ withdrawDate: -1 })
      .toArray();
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllWithdrawals(req, res) {
  try {
    const db = getDB();
    const withdrawals = await db
      .collection("withdrawals")
      .find({ status: "pending" })
      .sort({ withdrawDate: -1 })
      .toArray();
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function approveWithdrawal(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const withdrawal = await db.collection("withdrawals").findOne({ _id: new ObjectId(id) });
    if (!withdrawal) return res.status(404).json({ message: "Withdrawal not found" });
    await db.collection("withdrawals").updateOne({ _id: new ObjectId(id) }, { $set: { status: "approved" } });
    await db.collection("user").updateOne(
      { email: withdrawal.creatorEmail },
      { $inc: { credits: -withdrawal.withdrawalCredit } }
    );
    await db.collection("notifications").insertOne({
      message: `Your withdrawal of ${withdrawal.withdrawalCredit} credits ($${withdrawal.withdrawalAmount}) has been approved`,
      toEmail: withdrawal.creatorEmail,
      actionRoute: "/dashboard/creator/withdrawals",
      time: new Date(),
    });
    notifyWithdrawalProcessed(withdrawal.creatorEmail, withdrawal.withdrawalAmount).catch(() => {});
    res.json({ message: "Withdrawal approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createWithdrawal, getCreatorWithdrawals, getAllWithdrawals, approveWithdrawal };
