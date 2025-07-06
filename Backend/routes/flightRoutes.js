const express = require("express");
const router = express.Router();
const {
  searchFlights,
  priceFlight,
  liveAirportSearch,
  // airportSearch,
  seatMap,
  bookFlight,
  confirmBooking,
  getBookings,
  getBookingById,
  cancelBooking,
  getInvoice,
} = require("../controller/flightController");
const { verifyToken } = require("../middleware/authmiddleware");

// Public routes (no token required)
router.get("/flights/search", searchFlights);
router.post("/flights/price", priceFlight);
router.get("/flights/live-airport-search", liveAirportSearch);
router.post("/flights/seatmap", seatMap);

// Protected routes (token required)
// router.get("/flights/airport-search", airportSearch); // Note: This is not explicitly requested to be public, so it remains unchanged
router.post("/flights/book", verifyToken, bookFlight);
router.post("/flights/confirm-booking", verifyToken, confirmBooking);
router.get("/bookings", verifyToken, getBookings);
router.get("/bookings/:amadeusOrderId", verifyToken, getBookingById);
router.delete("/bookings/:amadeusOrderId/cancel", verifyToken, cancelBooking);
router.get("/bookings/:amadeusOrderId/invoice", verifyToken, getInvoice);

module.exports = router;