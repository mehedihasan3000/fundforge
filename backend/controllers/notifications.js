const { getDB } = require("../config/db");

async function getNotifications(req, res) {
  try {
    const db = getDB();
    const notifications = await db
      .collection("notifications")
      .find({ toEmail: req.user.email })
      .sort({ time: -1 })
      .limit(50)
      .toArray();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getNotifications };
