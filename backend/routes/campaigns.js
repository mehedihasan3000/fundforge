const express = require("express");
const { requireSession } = require("../middleware/session");
const { authorize } = require("../middleware/rbac");
const {
  getTopCampaigns,
  getCreatorCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAllCampaigns,
  getCampaignById,
  approveCampaign,
  rejectCampaign,
} = require("../controllers/campaigns");

const router = express.Router();

router.get("/top", getTopCampaigns);
router.get("/creator/mine", requireSession, authorize("creator"), getCreatorCampaigns);
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);
router.post("/", requireSession, authorize("creator"), createCampaign);
router.put("/:id", requireSession, authorize("creator"), updateCampaign);
router.delete("/:id", requireSession, authorize("creator"), deleteCampaign);
router.put("/:id/approve", requireSession, authorize("admin"), approveCampaign);
router.put("/:id/reject", requireSession, authorize("admin"), rejectCampaign);

module.exports = router;
