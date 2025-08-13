const jwt = require("jsonwebtoken");
const pool = require("../config/db");

exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB
      const userResult = await pool.query(
        "SELECT id, email, full_name, mobile_no, signup_type FROM users WHERE id = $1",
        [decoded.id]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      req.user = userResult.rows[0];
      next();

    } catch (error) {
      console.error("Auth Middleware Error:", error);
      res.status(401).json({ success: false, message: "Not authorized" });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: "No token provided" });
  }
};
