const express = require('express');
const { sendOTP, verifyOTP, signup, login, phoneNumber } = require('../controller/user.controller')
const userRouter = express.Router();

// Authentication routes
userRouter.post('/send-otp', sendOTP);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/phone/:phoneNumber', phoneNumber);

module.exports = userRouter;