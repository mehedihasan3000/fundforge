function authorize(...roles) {
  return async (req, res, next) => {
    try {
      const session = req.session;
      if (!session || !session.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (roles.length > 0 && !roles.includes(session.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }
      req.user = session.user;
      next();
    } catch (err) {
      res.status(500).json({ message: "Authorization error" });
    }
  };
}

module.exports = { authorize };
