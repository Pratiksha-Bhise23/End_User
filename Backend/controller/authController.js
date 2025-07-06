const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { generateOTP, sendOTP } = require("../services/otpService");

const login = async (req, res) => {
  const { phone } = req.body;

  if (!phone)
    return res.status(400).json({ error: "Phone number is required" });

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE phone = $1",
      [phone]
    );
    const user = userResult.rows[0]

    if (!user) {
      // User doesn't exist, ask for registration
      return res.json({
        status: "register",
        message: "Phone not found, please register",
        phone,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Insert new OTP or update existing OTP if there's a conflict
    await pool.query(
      `
      INSERT INTO otps (user_id, user_type, otp, expires_at) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id, user_type) 
      DO UPDATE SET otp = EXCLUDED.otp, expires_at = EXCLUDED.expires_at
      `,
      [user.id, "user", otp, expiresAt]
    );

    // Send OTP to phone and email
    await sendOTP(phone, otp, "sms", user.email); // Send to phone (SMS) and email
    return res.json({
      status: "otp_sent",
      message: "OTP sent to phone and email",
      phone,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const register = async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userResult.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const newUser = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    const user = newUser.rows[0];

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      "INSERT INTO otps (user_id, user_type, otp, expires_at) VALUES ($1, $2, $3, $4)",
      [user.id, "user", otp, expiresAt]
    );
    await sendOTP(email, otp, "email"); // Send OTP to email only during registration

    res.json({ status: "otp_sent", message: "OTP sent to email", email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const verifyOTP = async (req, res) => {
  const { phone, email, otp } = req.body;

  if (!otp || (!phone && !email)) {
    return res
      .status(400)
      .json({ error: "OTP and either phone or email are required" });
  }

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE phone = $1 OR email = $2",
      [phone || null, email || null]
    );
    const user = userResult.rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const otpResult = await pool.query(
      "SELECT * FROM otps WHERE user_id = $1 AND otp = $2 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
      [user.id, otp]
    );
    const otpRecord = otpResult.rows[0];

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Update phone if provided (e.g., during login or first verification)
    if (phone && !user.phone) {
      await pool.query("UPDATE users SET phone = $1 WHERE id = $2", [
        phone,
        user.id,
      ]);
    }

    await pool.query("DELETE FROM otps WHERE id = $1", [otpRecord.id]); // Remove used OTP

    const sessionId = jwt.sign(
      { id: user.id, phone: user.phone || phone, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: "verified",
      message: "OTP verified successfully",
      phone: user.phone || phone || "",
      email: user.email,
      session_id: sessionId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const logout = async (req, res) => {
  res.json({ status: "success", message: "Logged out successfully" });
};

module.exports = { login, register, verifyOTP, logout };
