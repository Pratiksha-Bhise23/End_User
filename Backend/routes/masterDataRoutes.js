const express = require('express');
const router = express.Router();
const {
  createTraveler,
  getTravelers,
  updateTraveler,
  deleteTraveler,
  getTraveler
} = require('../controller/masterDataController');
const { verifyToken } = require('../middleware/authmiddleware');

router.post('/travelers', verifyToken, createTraveler);
router.get('/travelers', verifyToken, getTravelers);
router.get('/travelers/:id', verifyToken, getTraveler); // Confirm this line
router.put('/travelers/:id', verifyToken, updateTraveler);
router.delete('/travelers/:id', verifyToken, deleteTraveler);

module.exports = router;