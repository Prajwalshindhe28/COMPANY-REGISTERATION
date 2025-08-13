// src/routes/jobApplicationRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const { applyForJob } = require("../controllers/jobApplicationController");

const router = express.Router();

// Multer config for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Apply for a job (with optional resume upload)
router.post("/apply", protect, upload.single("resume"), applyForJob);

module.exports = router;
