const pool = require("../config/db");

// Create a job
exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary_range, job_type } = req.body;

    // Ensure user has a company profile
    const company = await pool.query(
      "SELECT id FROM company_profile WHERE owner_id = $1",
      [req.user.id]
    );

    if (company.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Create company profile first" });
    }

    const result = await pool.query(
      `INSERT INTO jobs (company_id, title, description, location, salary_range, job_type)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [company.rows[0].id, title, description, location, salary_range, job_type]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
    res.json({ success: true, data: jobs.rows });
  } catch (error) {
    console.error("Get Jobs Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get a single job by ID
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);

    if (job.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, data: job.rows[0] });
  } catch (error) {
    console.error("Get Job By ID Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
