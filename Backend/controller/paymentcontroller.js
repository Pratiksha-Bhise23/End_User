const Razorpay = require("razorpay");
const crypto = require("crypto");
const pool = require("../config/db");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Create a payment order
const createPaymentOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  if (!currency || !receipt) {
    return res.status(400).json({ error: "Currency and receipt are required" });
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // ✅ Convert to paise (integer)
      currency,
      receipt,
      payment_capture: 1,
    });

    res.json({ status: "success", paymentOrder: order });
  } catch (error) {
    console.error("Error creating payment order:", error);
    res.status(500).json({
      error: "Failed to create payment order",
      details: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  if (!orderId || !paymentId || !signature) {
    return res
      .status(400)
      .json({ error: "Order ID, payment ID, and signature are required" });
  }

  try {
    //  Correct way to generate the signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature === signature) {
      //  Update the bookings table with signature & change status to 'confirmed'
      const query = `
        UPDATE bookings 
        SET signature = $1, status = 'confirmed' 
        WHERE payment_id = $2
        RETURNING id, user_id, status, signature;
      `;

      const result = await pool.query(query, [signature, paymentId]);

      if (result.rowCount > 0) {
        res.json({
          status: "success",
          message: "Payment verified and updated successfully",
          data: result.rows[0],
        });
      } else {
        res
          .status(404)
          .json({ error: "Booking not found for this payment ID" });
      }
    } else {
      res.status(400).json({ error: "Invalid payment signature" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      error: "Failed to verify payment",
      details: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
