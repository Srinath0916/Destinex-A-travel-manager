import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Login.css';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const LoginPage = ({ setIsActive, showForgotPassword }) => {
  const [loginMethod, setLoginMethod] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
    otp: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhoneNumber = (phone) => {
    return /^\+?[\d\s-]{10,}$/.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      
      console.log('Login response:', response.data); // Debug log
      
      if (response.data.success) {
        const token = response.data.Token || response.data.token;
        if (!token) {
          throw new Error('Invalid response format: missing token');
        }

        // Parse JWT token to get user data
        const decodedToken = parseJwt(token);
        console.log('Decoded token:', decodedToken); // Debug log

        // Extract user data from token and response
        const userData = {
          _id: decodedToken?.userId || response.data.user?._id,
          name: decodedToken?.name || response.data.user?.name,
          email: formData.email,
          phone: decodedToken?.phone || response.data.user?.phone || '',
          role: decodedToken?.role || response.data.user?.role || 'user'
        };

        console.log('Processed user data:', userData); // Debug log
        login(userData, token);
        setSuccess('Login successful! Redirecting...');
        
        // Get the redirect path from location state or default to home
        const from = location.state?.from || '/';
        setTimeout(() => navigate(from), 1000);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error); // Debug log
      setError(error.response?.data?.message || error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/auth/send-otp', {
        phoneNumber: formData.phoneNumber
      });
      
      if (response.data.success) {
        setOtpSent(true);
        setSuccess('OTP sent successfully!');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.otp || formData.otp.length < 6) {
      setError('Please enter a valid OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/auth/verify-otp', {
        phoneNumber: formData.phoneNumber,
        otp: formData.otp
      });
      
      console.log('OTP verification response:', response.data); 
      
      if (response.data.success) {
        if (response.data.userExists) {
          const token = response.data.Token || response.data.token;
          if (!token) {
            throw new Error('Invalid response format: missing token');
          }
          const user = parseJwt(token) || { name: 'User' };
          login(user, token);
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => navigate('/'), 1000);
        } else {
          setSuccess('OTP verified successfully!');
          setTimeout(() => navigate('/signup', { state: { phoneNumber: formData.phoneNumber } }), 1000);
        }
      } else {
        throw new Error(response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error); 
      setError(error.response?.data?.message || error.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderError = () => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-lg mb-4">
        <AlertCircle className="size-5" />
        <span>{error}</span>
      </div>
    );
  };

  const renderSuccess = () => {
    if (!success) return null;
    return (
      <div className="flex items-center gap-2 text-green-500 bg-green-50 p-3 rounded-lg mb-4">
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>{success}</span>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {loginMethod === 'email' ? (
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">SIGN IN</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {renderError()}
          {renderSuccess()}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="input-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed btn-login"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center space-y-4">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('otp');
                setError('');
                setSuccess('');
                setOtpSent(false);
                setFormData(prev => ({ ...prev, phoneNumber: '', otp: '' }));
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm btn-login"
            >
              Login with OTP instead
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">OTP Login</h1>
            <p className="text-gray-400">
              {otpSent ? 'Enter the OTP sent to your phone' : 'Enter your phone number to receive OTP'}
            </p>
          </div>

          {renderError()}
          {renderSuccess()}

          <div className="space-y-4">
            {otpSent ? (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">OTP</label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter OTP"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed btn-login"
          >
            {loading
              ? otpSent
                ? 'Verifying...'
                : 'Sending OTP...'
              : otpSent
                ? 'Verify OTP'
                : 'Send OTP'}
          </button>

          <div className="text-center space-y-4">
            {otpSent && (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setError('');
                  setSuccess('');
                  setFormData(prev => ({ ...prev, otp: '' }));
                }}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm btn-login"
              >
                Resend OTP
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setLoginMethod('email');
                setError('');
                setSuccess('');
                setOtpSent(false);
                setFormData(prev => ({ ...prev, phoneNumber: '', otp: '' }));
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm btn-login"
            >
              Login with Email instead
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginPage; 