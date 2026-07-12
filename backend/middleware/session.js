const { fromNodeHeaders } = require("better-auth/node");
const { getAuth } = require("../config/auth");

async function requireSession(req, res, next) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.session = session;
    req.user = session.user;
    next();
  } catch (err) {
    console.error("Session error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { requireSession };
