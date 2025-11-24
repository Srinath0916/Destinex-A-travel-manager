const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');
const userRouter = require('./routes/auth.route')
const bookingRouter = require('./routes/bookingRoutes')
const hotelRouter = require('./routes/hotelRoutes')
const paymentRouter = require('./routes/paymentRoutes')

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: Array.isArray(config.frontendURL) ? config.frontendURL : [config.frontendURL],
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', userRouter);
app.use('/destination', require('./routes/destinationRoutes'));
app.use('/booking', bookingRouter);
app.use('/hotel', hotelRouter);
app.use('/cities', require('./routes/cityRoutes'));
app.use('/packages', require('./routes/packageRoutes'));
app.use('/payment', paymentRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
