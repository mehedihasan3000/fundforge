const { getDB } = require("../config/db");

const CREDIT_PACKAGES = {
  "100": { price: 10, priceId: "price_1TseDTBUtDyQcaIdQSMDpY51" },
  "300": { price: 25, priceId: "price_1TseDUBUtDyQcaIdVvwpqMAy" },
  "800": { price: 60, priceId: "price_1TseDUBUtDyQcaIdwUtzZxH3" },
  "1500": { price: 110, priceId: "price_1TseDUBUtDyQcaIdAtrqX34J" },
};

async function getStripe() {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error("Stripe not configured");
  }
  return require("stripe")(stripeSecretKey);
}

async function createCheckoutSession(req, res) {
  try {
    const { credits } = req.body;
    const pkg = CREDIT_PACKAGES[credits];
    if (!pkg) {
      return res.status(400).json({ message: "Invalid credit package" });
    }

    const stripe = await getStripe();
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: pkg.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        credits: String(credits),
        amount: String(pkg.price),
        userEmail: req.user.email,
      },
      customer_email: req.user.email,
      success_url: `${frontendUrl}/dashboard/supporter/purchase-credits?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/dashboard/supporter/purchase-credits?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function confirmCheckoutSession(req, res) {
  try {
    const db = getDB();
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "Missing session ID" });
    }

    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    if (session.metadata.userEmail !== req.user.email) {
      return res.status(403).json({ message: "Session does not belong to you" });
    }

    const existing = await db.collection("payments").findOne({ stripePaymentId: sessionId });
    if (existing) {
      return res.json({ message: "Payment already confirmed", credits: Number(session.metadata.credits) });
    }

    const payment = {
      userEmail: req.user.email,
      userName: req.user.name,
      credits: Number(session.metadata.credits),
      amount: Number(session.metadata.amount),
      stripePaymentId: sessionId,
      date: new Date(),
    };
    await db.collection("payments").insertOne(payment);

    const result = await db.collection("user").updateOne(
      { email: req.user.email },
      { $inc: { credits: Number(session.metadata.credits) } }
    );

    if (result.matchedCount === 0) {
      console.error(`User not found for email: ${req.user.email}`);
      return res.status(404).json({ message: "User not found in database" });
    }

    res.json({ message: "Payment confirmed, credits added", credits: Number(session.metadata.credits) });
  } catch (err) {
    console.error("confirmCheckoutSession error:", err);
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

module.exports = { createCheckoutSession, confirmCheckoutSession, getPaymentHistory, getCreatorPaymentHistory };
