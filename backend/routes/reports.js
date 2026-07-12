const express = require("express");
const { requireSession } = require("../middleware/session");
const { authorize } = require("../middleware/rbac");
const { createReport, getAllReports, deleteReport } = require("../controllers/reports");

const router = express.Router();

router.post("/", requireSession, authorize("supporter"), createReport);
router.get("/", requireSession, authorize("admin"), getAllReports);
router.delete("/:id", requireSession, authorize("admin"), deleteReport);

module.exports = router;
