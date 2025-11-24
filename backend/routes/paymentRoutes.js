const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');
const { protect } = require('../middleware/authMiddleware');

// Create Razorpay order
router.post('/create-order', protect, paymentController.createOrder);

// Verify payment
router.post('/verify', protect, paymentController.verifyPayment);

module.exports = router; 