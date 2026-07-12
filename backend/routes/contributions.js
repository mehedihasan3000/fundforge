const express = require("express");
const { requireSession } = require("../middleware/session");
const { authorize } = require("../middleware/rbac");
const {
  createContribution,
  getPendingContributions,
  approveContribution,
  rejectContribution,
  getUserContributions,
  getUserApprovedContributions,
} = require("../controllers/contributions");

const router = express.Router();

router.post("/", requireSession, authorize("supporter"), createContribution);
router.get("/pending", requireSession, authorize("creator"), getPendingContributions);
router.put("/:id/approve", requireSession, authorize("creator"), approveContribution);
router.put("/:id/reject", requireSession, authorize("creator"), rejectContribution);
router.get("/mine", requireSession, authorize("supporter"), getUserContributions);
router.get("/approved", requireSession, authorize("supporter"), getUserApprovedContributions);

module.exports = router;
