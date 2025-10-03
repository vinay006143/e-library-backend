const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Adjust path if needed

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is present and has Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user; // Attach user info to request
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Request not authorized" });
  }
};

module.exports = requireAuth;
