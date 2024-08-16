const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    req.user = jwt.verify(token, "your_jwt_secret"); // Replace with your actual secret
    next();
  } catch {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;

