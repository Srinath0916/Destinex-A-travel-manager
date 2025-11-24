const OTP = require('../db/models/OTP.model');
const User = require('../db/models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const twilio = require('twilio');
const twilioClient = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const generateOTP = ()=>{
    return Math.floor(100000+Math.random()*900000).toString();
};

const sendOTP = async (req, res) => {

    try {
        const { phoneNumber } = req.body;

        const otp = generateOTP();

        await OTP.findOneAndDelete({ phoneNumber });
        await OTP.create({ phoneNumber, otp });

        await twilioClient.messages.create({
            body:`Your verification code is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });

    return res.status(200).json({success:true,message:"OTP sent successfully"});
    } catch (error) {
        console.log("Error in sending OTP", error);
        return res.status(500).json({success:false,message:"Error in sending OTP"});
    }
}

const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        

        if(!phoneNumber || !otp) return res.status(400).json({success:false,message:"All fields are required"});

        const otpRecord  = await OTP.findOne({ phoneNumber });
        console.log("OTP Record : ",otpRecord);
        if(!otpRecord) return res.status(400).json({success:false,message:"OTP Expired"});

        if(otpRecord.otp !== otp) return res.status(400).json({success:false,message:"Invalid OTP"});

        await OTP.findOneAndDelete({ phoneNumber });

        const existingUser = await User.findOne({ phoneNumber });
        if (existingUser) {
            return res.status(200).json({ success: true, message: "OTP verified successfully", userExists: true, user:{userName:existingUser.userName} });
        }


        return res.status(200).json({success:true,message:"OTP verified successfully"});
    }
    catch (error) {
        console.log("Error in verifying OTP", error);
        return res.status(500).json({success:false,message:"Error in verifying OTP"});
    }
}

const signup = async (req, res) => {
    try {
        const { phoneNumber, userName, email, password, dob } = req.body;

        if(!userName || !email || !password || !dob) return res.status(400).json({success:false,message:"Name, email, password and date of birth are required"});

        if(phoneNumber) {
            const existingUserByPhone = await User.findOne({ phoneNumber });
            if(existingUserByPhone) return res.status(400).json({success:false,message:"Phone number already registered"});
        }

        const existingUserByEmail = await User.findOne({ email });
        if(existingUserByEmail) return res.status(400).json({success:false,message:"Email already registered"});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ 
            phoneNumber, 
            userName, 
            email, 
            password: hashedPassword, 
            dob: new Date(dob) 
        });

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({success:true,message:"User created successfully",Token:token});
    }
    catch (error) {
        console.log("Error in signing up", error);
        return res.status(500).json({success:false,message:"Error in signing up"});
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({ success: true, message: "User logged in successfully", Token: token });
    }
    catch (error) {
        console.log("Error in logging in with email", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const phoneNumber = async (req, res) => {
    try {
        const user = await User.findOne({ phoneNumber: req.params.phoneNumber });
        if(user){
            res.json({user});
        } 
        else{
            res.json({user:null})
        }
    }
    catch (error) {
        console.log("Error in getting user by phone number", error);
        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
}

module.exports = { sendOTP, verifyOTP, signup, login, phoneNumber };