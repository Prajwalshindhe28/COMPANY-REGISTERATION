// src/controllers/jobApplicationController.js
const pool = require("../config/db");

// Apply for a job
exports.applyForJob = async (req, res) => {
  try {
    const { job_id, cover_letter } = req.body;
    let resume_url = null;

    if (!job_id) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    // Check if job exists
    const job = await pool.query("SELECT * FROM jobs WHERE id = $1", [job_id]);
    if (job.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check if already applied
    const existing = await pool.query(
      "SELECT * FROM job_applications WHERE job_id = $1 AND applicant_id = $2",
      [job_id, req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: "You have already applied for this job" });
    }

    // If resume uploaded
    if (req.file) {
      resume_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      `INSERT INTO job_applications (job_id, applicant_id, resume_url, cover_letter)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [job_id, req.user.id, resume_url, cover_letter || null]
    );

    res.status(201).json({ success: true, message: "Applied successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
