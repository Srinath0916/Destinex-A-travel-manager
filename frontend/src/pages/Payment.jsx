import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const Payment = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const bookingDetails = location.state?.bookingDetails;

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!bookingDetails) {
      toast.error('No booking details found');
      navigate(`/package/${packageId}`);
      return;
    }

    const loadRazorpay = async () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;

        script.onload = () => {
          setRazorpayLoaded(true);
          setLoading(false);
        };

        script.onerror = () => {
          toast.error('Failed to load payment gateway. Please try again.');
          setError('Failed to load payment gateway. Please try again.');
          setLoading(false);
        };

        document.body.appendChild(script);
      } catch (error) {
        toast.error('Failed to initialize payment gateway. Please try again.');
        setError('Failed to initialize payment gateway. Please try again.');
        setLoading(false);
      }
    };

    loadRazorpay();

    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, [packageId, navigate, isAuthenticated, user, bookingDetails, location]);

  const handlePayment = async () => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to continue');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment gateway is not ready. Please try again.');
      setError('Payment gateway is not ready. Please try again.');
      return;
    }

    setProcessingPayment(true);
    setError(null);

    try {
      const orderData = await axios.post('/payment/create-order', {
        amount: bookingDetails.totalCost * 100,
        packageId: packageId,
        bookingDetails: {
          ...bookingDetails,
          userId: user._id || user.userId,
          userName: user.name,
          userEmail: user.email,
          userPhone: user.phone
        }
      });

      if (!orderData.data) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.data.amount,
        currency: "INR",
        name: "Destinex Travel",
        description: `Payment for ${bookingDetails.packageDetails.name}`,
        order_id: orderData.data.data.id,
        handler: async function (response) {
          try {
            const verification = await axios.post('/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              packageId: packageId,
              bookingDetails: {
                ...bookingDetails,
                userId: user._id || user.userId,
                userName: user.name,
                userEmail: user.email,
                userPhone: user.phone,
                duration: bookingDetails.duration,
                groupType: bookingDetails.groupType
              }
            });

            if (verification.data.success) {
              toast.success('Payment successful!');
              navigate('/bookings');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
            setError('Payment verification failed. Please contact support.');
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: user.name || "User",
          email: user.email || "",
          contact: user.phone || ""
        },
        theme: {
          color: "#22c55e"
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function () {
        toast.error('Payment failed. Please try again.');
        setError('Payment failed. Please try again.');
        setProcessingPayment(false);
      });

      paymentObject.open();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
      setError(error.response?.data?.message || 'Payment failed. Please try again.');
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-lg font-medium text-gray-700">Loading payment gateway...</p>
          <p className="text-sm text-gray-500 mt-2">Securing your transaction</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Invalid Booking</h3>
          <p className="text-gray-600">No booking details found. Please start over.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
          error: {
            duration: 4000,
            theme: {
              primary: '#ff4b4b',
            },
          },
        }}
      />
      {/* Header Section */}
      <div className="relative overflow-hidden w-full min-h-[200px] flex items-center justify-center">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 w-full"></div>
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 w-full">
          <div className="absolute inset-0 w-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Back Button - Positioned absolutely */}
        <button 
          onClick={() => navigate(`/package-planner/${packageId}`)}
          className="absolute top-6 left-6 z-50 flex items-center font-bold uppercase text-white shadow-lg px-6 py-2"
          style={{
            background: 'linear-gradient(90deg, #ffb300 0%, #ff7300 100%)',
            clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%, 5% 50%)',
            letterSpacing: '1px',
            fontSize: '1.25rem',
            padding: '5px 7px',
          }}
        >
          <svg className="w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          BACK
        </button>

        {/* Content */}
        <div className="relative z-10 w-full flex items-center justify-center" style={{ minHeight: "220px" }}>
          {/* Hero Content */}
          <div className="flex items-center">
            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 mr-6">
             
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
                Secure <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Payment</span>
              </h1>
              <p className="text-xl text-white/80" style={{marginTop: '10px'}}>
                Complete your booking with confidence and security
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-indigo-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 mt-[-60px]" style={{marginTop: '50px',marginBottom: '50px'}}>
        {/* Left side - Trip visualization */}
        <div className="w-full lg:w-1/2 max-w-lg" >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-6" style={{marginTop: '30px'}}>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Dream Trip</h2>
              <p className="text-gray-600">Ready for an unforgettable adventure?</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                    </svg>
                  </span>
                  {bookingDetails.packageDetails.name}
                </h3>
                <p className="text-gray-700 leading-relaxed" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>{bookingDetails.packageDetails.description}</p>
              </div>

              {/* Travel details icons */}
              <div className="grid grid-cols-2 gap-4" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                {/* Adults Box */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-md flex items-center p-4 gap-3 border border-blue-100">
                  <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm font-semibold">Adults</div>
                    <div className="text-2xl font-bold text-blue-700">{bookingDetails.adults || 1}</div>
                  </div>
                </div>
                {/* Children Box */}
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl shadow-md flex items-center p-4 gap-3 border border-pink-100">
                  <div className="w-10 h-10 bg-pink-200 rounded-xl flex items-center justify-center" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm font-semibold">Children</div>
                    <div className="text-2xl font-bold text-pink-700">{bookingDetails.children || 0}</div>
                  </div>
                </div>
                </div>
                {/* Travel Date Box */}
                <div className=" mt-4 bg-gradient-to-br from-indigo-50 to-purple-100 rounded-2xl shadow-md flex items-center p-4 gap-3 border border-purple-100" style={{marginTop: '20px',marginBottom: '20px',marginLeft: '10px',marginRight: '10px'}}>
                  <div className="w-10 h-10 bg-indigo-200 rounded-xl flex items-center justify-center" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '40px',marginRight: '10px'}}>
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm font-semibold">Travel Date</div>
                    <div className="text-2xl font-bold text-indigo-700">{bookingDetails.travelDate || 'Not specified'}</div>
                  </div>
                </div>
              
            </div>
          </div>
        </div>

        {/* Right side - Payment */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4" style={{marginTop: '30px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2">Secure Payment</h1>
                <p className="text-blue-100" style={{marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>Complete your booking with confidence</p>
              </div>
            </div>

            {/* Payment body */}
            <div className="p-8">
              {/* Total amount highlight */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-md flex items-center p-4 gap-3 border border-green-100 mb-6" style={{marginTop: '20px',marginBottom: '20px',marginLeft: '10px',marginRight: '10px'}}>
                <div className="w-10 h-10 bg-green-200 rounded-xl flex items-center justify-center" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 0V4m0 12v4m8-8h-4m-8 0H4" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-500 text-sm font-semibold" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>Total Amount</div>
                  <div className="text-3xl font-bold text-green-700" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>₹{bookingDetails.totalCost?.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-500" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>Including all taxes and fees</div>
                </div>
              </div>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-3 mb-6" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                {/* Secure Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 shadow-sm" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginTop: '2px',marginBottom: '2px',marginLeft: '3px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-semibold text-green-700 text-sm" style={{marginRight: '5px'}}>Secure</span>
                </div>
                {/* Encrypted Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 shadow-sm" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginTop: '2px',marginBottom: '2px',marginLeft: '3px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-semibold text-blue-700 text-sm" style={{marginRight: '5px'}}>Encrypted</span>
                </div>
                {/* Verified Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 shadow-sm" style={{marginTop: '10px',marginBottom: '10px',marginLeft: '10px',marginRight: '10px'}}>
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{marginTop: '2px',marginBottom: '2px',marginLeft: '3px'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold text-purple-700 text-sm" style={{marginRight: '5px'}}>Verified</span>
                </div>
              </div>

              {/* Payment button */}
              <button
                onClick={handlePayment}
                disabled={processingPayment || !razorpayLoaded}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#3a3dff] to-[#d100c9] text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                style={{letterSpacing: '1px',marginTop: '20px',marginBottom: '10px',marginLeft: '130px',marginRight: '10px',width: '40%',height: '50px'}}
              >
                {processingPayment ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
                      <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
                      <rect x="16" y="14" width="4" height="2" rx="0.5" fill="currentColor" />
                    </svg>
                    <span className="tracking-wider">PAY</span>
                  </>
                )}
              </button>

              {/* Payment methods */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-3">Powered by Razorpay - Accept all payment methods</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;