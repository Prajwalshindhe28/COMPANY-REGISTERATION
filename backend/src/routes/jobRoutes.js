

const express = require("express");
const router = express.Router();
const { createJob, getJobs, getJobById } = require("../controllers/jobController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createJob); // Create job
router.get("/", getJobs);             // Get all jobs
router.get("/:id", getJobById);       // Get job by ID

module.exports = router;
