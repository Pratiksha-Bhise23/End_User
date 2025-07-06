
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  console.log("🔍 Debugging verifyToken - Token Received:", token); // Log received token

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(403).json({ error: "Invalid token" });
    }

    console.log("✅ Token Decoded Successfully:", decoded); // Log decoded token
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
