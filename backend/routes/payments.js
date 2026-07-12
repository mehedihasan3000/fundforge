const express = require("express");
const { requireSession } = require("../middleware/session");
const { authorize } = require("../middleware/rbac");
const {
  createPaymentIntent,
  confirmPayment,
  getPaymentHistory,
  getCreatorPaymentHistory,
} = require("../controllers/payments");

const router = express.Router();

router.post("/create-payment-intent", requireSession, authorize("supporter"), createPaymentIntent);
router.post("/confirm", requireSession, authorize("supporter"), confirmPayment);
router.get("/history", requireSession, authorize("supporter"), getPaymentHistory);
router.get("/creator-history", requireSession, authorize("creator"), getCreatorPaymentHistory);

module.exports = router;
