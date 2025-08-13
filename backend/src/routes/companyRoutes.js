const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const pool = require("../config/db");
const { upsertCompanyProfile, getCompanyProfile } = require("../controllers/companyController");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// 📌 Company profile routes
router.post("/profile", protect, upsertCompanyProfile);
router.get("/profile", protect, getCompanyProfile);

// 📌 Upload Logo
router.post("/upload-logo", protect, upload.single("logo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const logoUrl = `/uploads/${req.file.filename}`;
    await pool.query(
      "UPDATE company_profile SET logo_url = $1 WHERE owner_id = $2",
      [logoUrl, req.user.id]
    );

    res.json({ success: true, message: "Logo uploaded successfully", logo_url: logoUrl });
  } catch (error) {
    console.error("Upload Logo Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 📌 Upload Banner
router.post("/upload-banner", protect, upload.single("banner"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    const bannerUrl = `/uploads/${req.file.filename}`;
    await pool.query(
      "UPDATE company_profile SET banner_url = $1 WHERE owner_id = $2",
      [bannerUrl, req.user.id]
    );

    res.json({ success: true, message: "Banner uploaded successfully", banner_url: bannerUrl });
  } catch (error) {
    console.error("Upload Banner Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
