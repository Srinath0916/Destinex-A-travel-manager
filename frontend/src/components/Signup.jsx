import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import axios from '../utils/axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Signup = ({ setIsActive, onSignupSuccess }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData ] = useState({
        userName: '',
        email: '',
        password: '',
        dob: '',
        phoneNumber: ''
    });

    useEffect(() => {
        if (location.state?.phoneNumber) {
            setFormData(prev => ({
                ...prev,
                phoneNumber: location.state.phoneNumber
            }));
        }
    }, [location.state]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePhoneNumber = (phone) => {
        return /^\+?[\d\s-]{10,}$/.test(phone);
    };

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }

        setError('');
        setSuccess('');
    }

    const validateForm = () => {
        if (!formData.userName.trim()) {
            setError('Name is required');
            return false;
        }

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (!validatePhoneNumber(formData.phoneNumber)) {
            setError('Please enter a valid phone number');
            return false;
        }

        if (passwordStrength < 3) {
            setError('Password is too weak. Please use a stronger password');
            return false;
        }

        if (!formData.dob) {
            setError('Date of birth is required');
            return false;
        }

        return true;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/auth/signup', formData);

            if (response.data.success) {
                setSuccess('Account created successfully!');
                // Store the token and user data
                const token = response.data.Token;
                const user = {
                    userName: formData.userName,
                    email: formData.email
                };
                login(user, token);
                // Navigate to home page after a short delay
                setTimeout(() => {
                    navigate('/');
                }, 1000);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message;
            if (errorMessage === 'All fields are required') {
                setError('Please fill in all required fields: Name, Email, Password, and Date of Birth');
            } else {
                setError(errorMessage || 'Signup failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

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

    const renderPasswordStrength = () => {
        if (!formData.password) return null;
        
        const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
        const strengthText = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
        
        return (
            <div className="mt-2">
                <div className="flex gap-1 h-1">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-full ${i < passwordStrength ? strengthColors[i] : 'bg-gray-200'}`}
                        />
                    ))}
                </div>
                <p className={`text-sm mt-1 ${passwordStrength < 3 ? 'text-red-500' : 'text-green-500'}`}>
                    Password Strength: {strengthText[passwordStrength - 1]}
                </p>
            </div>
        );
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                <p className="text-gray-400">Join us to start your journey</p>
            </div>

            {renderError()}
            {renderSuccess()}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="userName"
                        value={formData.userName}
                        onChange={handleChange}
                        className="input"
                        placeholder="Enter your full name"
                        required
                    />
                </div>

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

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input pr-10"
                            placeholder="Create a password"
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
                    {renderPasswordStrength()}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="input"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed btn-login"
                >
                    {loading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
        </div>
    )
}

export default Signup