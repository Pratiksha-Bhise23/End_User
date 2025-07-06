


const express = require("express");
const router = express.Router();
const {
  getAllCountries,
  updateCountryCurrency,
  convertCurrency,
} = require("../controller/flightController");

 // GET all countries
router.get("/", getAllCountries);
router.patch("/:name/currency", updateCountryCurrency);
router.post("/currency/convert", convertCurrency);

module.exports = router;