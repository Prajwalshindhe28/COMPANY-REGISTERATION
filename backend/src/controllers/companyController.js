// src/controllers/companyController.js
const pool = require("../config/db");

// Create or Update Company Profile
exports.upsertCompanyProfile = async (req, res) => {
  try {
    const {
      company_name,
      address,
      city,
      state,
      country,
      postal_code,
      website,
      logo_url,
      banner_url,
      industry,
      founded_date,
      description,
      social_links
    } = req.body;

    // Insert or update using UPSERT
    const result = await pool.query(
      `INSERT INTO company_profile (
        owner_id, company_name, address, city, state, country, postal_code,
        website, logo_url, banner_url, industry, founded_date, description, social_links
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (owner_id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        address = EXCLUDED.address,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        country = EXCLUDED.country,
        postal_code = EXCLUDED.postal_code,
        website = EXCLUDED.website,
        logo_url = EXCLUDED.logo_url,
        banner_url = EXCLUDED.banner_url,
        industry = EXCLUDED.industry,
        founded_date = EXCLUDED.founded_date,
        description = EXCLUDED.description,
        social_links = EXCLUDED.social_links,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *`,
      [
        req.user.id,
        company_name,
        address,
        city,
        state,
        country,
        postal_code,
        website,
        logo_url,
        banner_url,
        industry,
        founded_date,
        description,
        social_links
      ]
    );

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Company Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Company Profile
exports.getCompanyProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM company_profile WHERE owner_id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Company profile not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Get Company Profile Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Upload Banner
exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const bannerUrl = `/uploads/${req.file.filename}`;

    // Update the company's banner
    await pool.query(
      "UPDATE company_profile SET banner_url = $1, updated_at = NOW() WHERE owner_id = $2",
      [bannerUrl, req.user.id]
    );

    res.json({
      success: true,
      message: "Banner uploaded successfully",
      banner_url: bannerUrl
    });
  } catch (error) {
    console.error("Banner Upload Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
