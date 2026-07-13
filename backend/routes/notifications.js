const express = require("express");
const { requireSession } = require("../middleware/session");
const { getNotifications } = require("../controllers/notifications");

const router = express.Router();

router.get("/", requireSession, getNotifications);

module.exports = router;
