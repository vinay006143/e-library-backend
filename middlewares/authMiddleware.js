// Dummy middleware for admin auth
exports.verifyAdmin = (req, res, next) => {
  // Implement your logic (e.g., token decode, role check)
  const isAdmin = true; // Replace with real check

  if (!isAdmin) return res.status(403).json({ message: "Access denied" });
  next();
};


// const jwt = require('jsonwebtoken');

// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).json({ message: "Access denied. No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // Makes req.user available in controller
//     next();
//   } catch (error) {
//     res.status(400).json({ message: "Invalid token." });
//   }
// };

// module.exports = authMiddleware;