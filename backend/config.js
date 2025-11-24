require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  frontendURL: process.env.NODE_ENV === 'production' 
    ? ['https://destinex-frontend.onrender.com', 'http://localhost:5173']
    : 'http://localhost:5173'
}; 