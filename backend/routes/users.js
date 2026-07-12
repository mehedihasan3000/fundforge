const express = require("express");
const { requireSession } = require("../middleware/session");
const { authorize } = require("../middleware/rbac");
const { getAllUsers, updateUserRole, deleteUser } = require("../controllers/users");

const router = express.Router();

router.get("/", requireSession, authorize("admin"), getAllUsers);
router.put("/:id/role", requireSession, authorize("admin"), updateUserRole);
router.delete("/:id", requireSession, authorize("admin"), deleteUser);

module.exports = router;
