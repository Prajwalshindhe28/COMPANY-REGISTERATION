const express = require("express");
const router = express.Router();
const { register, login, sendEmailVerification, verifyEmail } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const pool = require("../config/db");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, full_name, mobile_no, signup_type FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/verify-email/send", protect, sendEmailVerification);
router.get("/verify-email", verifyEmail);

module.exports = router;
