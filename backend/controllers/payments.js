const { getDB } = require("../config/db");

const CREDIT_PACKAGES = {
  "100": 10,
  "300": 25,
  "800": 60,
  "1500": 110,
};

async function createPaymentIntent(req, res) {
  try {
    const { credits } = req.body;
    const price = CREDIT_PACKAGES[credits];
    if (!price) {
      return res.status(400).json({ message: "Invalid credit package" });
    }
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return res.status(500).json({ message: "Stripe not configured" });
    }
    const stripe = require("stripe")(stripeSecretKey);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100,
      currency: "usd",
      metadata: { credits: String(credits), userEmail: req.user.email },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function confirmPayment(req, res) {
  try {
    const db = getDB();
    const { credits, amount, stripePaymentId } = req.body;
    if (!credits || !amount || !stripePaymentId) {
      return res.status(400).json({ message: "Missing payment info" });
    }
    const payment = {
      userEmail: req.user.email,
      userName: req.user.name,
      credits: Number(credits),
      amount: Number(amount),
      stripePaymentId,
      date: new Date(),
    };
    await db.collection("payments").insertOne(payment);
    await db.collection("users").updateOne(
      { email: req.user.email },
      { $inc: { credits: Number(credits) } }
    );
    res.json({ message: "Payment confirmed, credits added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getPaymentHistory(req, res) {
  try {
    const db = getDB();
    const payments = await db
      .collection("payments")
      .find({ userEmail: req.user.email })
      .sort({ date: -1 })
      .toArray();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getCreatorPaymentHistory(req, res) {
  try {
    const db = getDB();
    const payments = await db
      .collection("withdrawals")
      .find({ creatorEmail: req.user.email })
      .sort({ withdrawDate: -1 })
      .toArray();
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createPaymentIntent, confirmPayment, getPaymentHistory, getCreatorPaymentHistory };
