const Razorpay = require('razorpay');
const crypto = require('crypto');
const bookingSchema = require('../db/models/bookingModel');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
exports.createOrder = async (req, res) => {
  try {
    console.log('Creating order with data:', req.body); // Debug log
    console.log('User from request:', req.user); // Debug log
    const { amount, packageId, bookingDetails } = req.body;

    if (!amount || !packageId) {
      return res.status(400).json({
        success: false,
        message: 'Amount and packageId are required'
      });
    }

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        packageId: packageId,
        userId: req.user._id || req.user.userId // Handle both formats
      }
    };

    console.log('Creating Razorpay order with options:', options); // Debug log
    const order = await razorpay.orders.create(options);
    console.log('Order created:', order); // Debug log

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    console.log('Verifying payment with data:', req.body); // Debug log
    console.log('User from request:', req.user); // Debug log
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      packageId,
      bookingDetails
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Missing required fields'
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Create or update booking
      try {
        const booking = await bookingSchema.create({
          userId: req.user._id || req.user.userId, // Handle both formats
          packageId: packageId,
          adults: bookingDetails.adults || 1,
          children: bookingDetails.children || 0,
          travelDate: bookingDetails.travelDate,
          specialRequirements: bookingDetails.specialRequirements || '',
          totalPrice: bookingDetails.totalCost,
          numberOfPeople: (bookingDetails.adults || 1) + (bookingDetails.children || 0),
          destinationId: bookingDetails.packageDetails.destination,
          status: 'confirmed',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          duration: bookingDetails.packageDetails.duration || '7 Days', // Default duration
          groupType: 'Family' // Default group type
        });

        console.log('Booking created:', booking); // Debug log

        res.json({
          success: true,
          message: 'Payment verified successfully',
          booking: booking
        });
      } catch (bookingError) {
        console.error('Error creating booking:', bookingError);
        res.status(500).json({
          success: false,
          message: 'Payment verified but failed to create booking',
          error: bookingError.message
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid signature'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  }
}; 