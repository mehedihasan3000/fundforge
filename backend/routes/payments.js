const express = require("express");
const { requireSession } = require("../middleware/session");
const { authorize } = require("../middleware/rbac");
const {
  createCheckoutSession,
  confirmCheckoutSession,
  getPaymentHistory,
  getCreatorPaymentHistory,
} = require("../controllers/payments");

const router = express.Router();

router.post("/create-checkout-session", requireSession, authorize("supporter"), createCheckoutSession);
router.post("/confirm-checkout-session", requireSession, authorize("supporter"), confirmCheckoutSession);
router.get("/history", requireSession, authorize("supporter"), getPaymentHistory);
router.get("/creator-history", requireSession, authorize("creator"), getCreatorPaymentHistory);

module.exports = router;
