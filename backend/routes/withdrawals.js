const express = require("express");
const { requireSession } = require("../middleware/session");
const { authorize } = require("../middleware/rbac");
const {
  createWithdrawal,
  getCreatorWithdrawals,
  getAllWithdrawals,
  approveWithdrawal,
} = require("../controllers/withdrawals");

const router = express.Router();

router.post("/", requireSession, authorize("creator"), createWithdrawal);
router.get("/mine", requireSession, authorize("creator"), getCreatorWithdrawals);
router.get("/pending", requireSession, authorize("admin"), getAllWithdrawals);
router.put("/:id/approve", requireSession, authorize("admin"), approveWithdrawal);

module.exports = router;
