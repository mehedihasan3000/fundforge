const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function getAllUsers(req, res) {
  try {
    const db = getDB();
    const users = await db.collection("users").find({}).project({ password: 0 }).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateUserRole(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    const { role } = req.body;
    if (!["supporter", "creator", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    await db.collection("users").updateOne({ _id: new ObjectId(id) }, { $set: { role } });
    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const db = getDB();
    const { id } = req.params;
    await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllUsers, updateUserRole, deleteUser };
