const express = require('express');
const router = express.Router();
const { login, register, verifyOTP, logout } = require('../controller/authController');
const { verifyToken } = require('../middleware/authmiddleware');

router.post('/login', login);
router.post('/register', register);
router.post('/verify-otp', verifyOTP);
router.post('/logout', verifyToken, logout);

module.exports = router;