import React, { useState } from 'react'
import axios from '../utils/axios'
import { useNavigate } from 'react-router-dom'

const PhoneVerification = ({ onVerificationComplete }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleOTP = async (e)=>{
        e.preventDefault();

        if(!phoneNumber || phoneNumber.length<10){
            setMessage('Please enter a valid phone number');
            return;
        }

        try {
            setLoading(true);
            setMessage('');
            const response = await axios.post('/auth/send-otp', { phoneNumber });

            if(response.data.success){
                setOtpSent(true);
                setMessage('OTP Sent Successfully');
            }
        } catch (error) {
            setMessage(error.response?.data?.message);
        }
        finally{
            setLoading(false);
        }
    }

    const handleVerifyOTP = async (e)=>{
        e.preventDefault();

        if(!otp || otp.length<6){
            setMessage('Please enter a valid OTP');
            return;
        }

        try {
            setLoading(true);
            setMessage('');
            console.log("Request Body : ",{phoneNumber, otp});
            const response = await axios.post('/auth/verify-otp', { phoneNumber, otp });

            if(response.data.success){
                setMessage('OTP Verified Successfully');

                if(response.data.userExists){
                  onVerificationComplete({userName:response.data.user.userName, phoneNumber});
                }
                else{
                  onVerificationComplete(phoneNumber);
                }
            }
        } catch (error) {
            setMessage(error.response?.data?.message);
        }
        finally{
            setLoading(false);
        }
    }

    const handleResendOTP = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setMessage('');
            const response = await axios.post('/auth/send-otp', { phoneNumber });

            if(response.data.success){
                setOtpSent(true);
                setMessage('OTP Sent Successfully');
            }
        } catch (error) {
            setMessage(error.response?.data?.message);
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Phone Verification</h2>
            <form onSubmit={otpSent ? handleVerifyOTP : handleOTP} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your phone number"
                        required
                    />
                </div>

                {otpSent && (
                    <div className="space-y-2">
                        <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter the OTP sent to your phone"
                            required
                        />
                    </div>
                )}

                {message && (
                    <div className="p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg">
                        <p className="text-red-500 text-sm">{message}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </span>
                    ) : otpSent ? (
                        'Verify OTP'
                    ) : (
                        'Send OTP'
                    )}
                </button>

                {otpSent && (
                    <button
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                        className="w-full py-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-medium"
                    >
                        Resend OTP
                    </button>
                )}
            </form>
        </div>
    )
}

export default PhoneVerification