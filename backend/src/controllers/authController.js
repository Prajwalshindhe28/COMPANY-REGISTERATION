const admin = require("../config/firebase");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const nodemailer = require("nodemailer");

// REGISTER
const register = async (req, res) => {
  try {
    const { email, password, full_name, gender, mobile_no, signup_type } = req.body;

    if (!email || !password || !full_name || !mobile_no) {
      return res.status(400).json({ success: false, message: "Please provide all required fields." });
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: full_name,
      phoneNumber: mobile_no.startsWith("+") ? mobile_no : `+91${mobile_no}`,
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, full_name, signup_type, gender, mobile_no)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [email, hashedPassword, full_name, signup_type || "email", gender || null, mobile_no]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify email.",
      data: {
        firebase_uid: userRecord.uid,
        user_id: result.rows[0].id,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user.id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, full_name: user.full_name },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Ethereal test account transporter
async function createTestTransporter() {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

// SEND EMAIL VERIFICATION
const sendEmailVerification = async (req, res) => {
  try {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const verifyLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`;

    const transporter = await createTestTransporter();

    let info = await transporter.sendMail({
      from: '"Bluestock" <no-reply@bluestock.com>',
      to: req.user.email,
      subject: "Verify your email",
      html: `<h2>Email Verification</h2>
             <p>Click below to verify your email:</p>
             <a href="${verifyLink}">${verifyLink}</a>`,
    });

    console.log("✅ Preview URL:", nodemailer.getTestMessageUrl(info));

    res.json({ success: true, message: "Verification email sent (check console for preview URL)" });
  } catch (error) {
    console.error("Email Verification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await pool.query("UPDATE users SET is_email_verified = true WHERE id = $1", [decoded.id]);

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.error("Verify Email Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  sendEmailVerification,
  verifyEmail
};
