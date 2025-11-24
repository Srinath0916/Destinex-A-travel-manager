import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Calendar, MapPin, CreditCard, Clock, X, CheckCircle, AlertCircle, Plane, Globe, Star, Phone, Mail } from 'lucide-react';

const Bookings = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCancelBooking = async (bookingId) => {
    console.log(`Attempting to cancel booking with ID: ${bookingId}`);
    try {
      const response = await axios.put(`/booking/bookings/${bookingId}`, { status: 'cancelled' });

      if (response.data.success) {
        alert('Booking cancelled successfully!');
        fetchBookings();

      } else {
        alert(`Failed to cancel booking: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('An error occurred while cancelling the booking.');
    }
  };

  const fetchBookings = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userId = user._id || user.userId;
      if (!userId) {
        setError('User ID not available.');
        setLoading(false);
        return;
      }

      console.log(`Fetching bookings for userId: ${userId}`);
      const response = await axios.get(`/booking/bookings/${userId}`);
      console.log('Fetched bookings data:', response.data);
      setBookings(response.data.booking);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated, user]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'confirmed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'from-emerald-500 to-teal-500',
          bg: 'bg-emerald-50',
          text: 'text-emerald-700',
          border: 'border-emerald-200'
        };
      case 'cancelled':
        return {
          icon: <X className="w-5 h-5" />,
          color: 'from-red-500 to-rose-500',
          bg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-200'
        };
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5" />,
          color: 'from-amber-500 to-orange-500',
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-200'
        };
      default:
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          color: 'from-blue-500 to-indigo-500',
          bg: 'bg-blue-50',
          text: 'text-blue-700',
          border: 'border-blue-200'
        };
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-teal-600/5"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(59, 130, 246, 0.1) 2px, transparent 0),
                           radial-gradient(circle at 75px 75px, rgba(168, 85, 247, 0.1) 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}></div>

        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse flex items-center justify-center shadow-2xl">
                <Plane className="w-8 h-8 text-white animate-bounce" />
              </div>
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Preparing Your Journey</h2>
            <p className="text-gray-600">Loading your travel experiences...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connection Lost</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={fetchBookings}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Reconnect
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-slate-50">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="max-w-lg w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-white/20">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Globe className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Back, Traveler</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Sign in to access your bookings and continue your journey with us.
            </p>
            <Link
              to="/login"
              className="inline-block w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-slate-50 relative">
        {/* Back to Home Button - Top Left */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-50 flex items-center font-bold uppercase text-white shadow-lg px-6 py-2"
          style={{
            background: 'linear-gradient(90deg, #ffb300 0%, #ff7300 100%)',
            clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%, 5% 50%)',
            letterSpacing: '1px',
            fontSize: '1.25rem',
            padding: '5px 7px',
          }}
        >
          <Home className="w-6 h-6 mr-2 text-white" />
          HOME
        </Link>
        {/* Premium Header Section */}
        <div className="relative overflow-hidden w-full min-h-[400px] flex items-center justify-center">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 w-full"></div>
          {/* Geometric Pattern Overlay */}
          <div className="absolute inset-0 opacity-20 w-full">
            <div className="absolute inset-0 w-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`,
            }}></div>
          </div>

          {/* Content */}
          <div className="relative z-10 w-full flex items-center justify-center" style={{ minHeight: "220px" }}>
            {/* Hero Content */}
            <div className="flex items-center">
              <div className="p-4  bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 mr-6">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
                  My <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Journeys</span>
                </h1>
                <p className="text-xl text-white/80" style={{marginTop: '10px'}}>
                  Track your adventures and manage your travel experiences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative -mt-4 z-20 w-full" style={{marginTop: '10px',paddingLeft: '10px',paddingRight: '10px'}}>
          <div className="w-full px-0 pb-16">
            {bookings.length === 0 ? (
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100 backdrop-blur-sm">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center mx-auto mb-8 border-4 border-blue-100">
                    <MapPin className="w-16 h-16 text-blue-600"/>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-800 mb-6">Your Adventure Awaits</h2>
                  <Link
                    to="/packages"
                    className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 group"
                  >
                    <Globe className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    Explore Destinations
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stats Header */}
                <div className="bg-white" style={{marginLeft: '150px',marginRight: '10px',marginBottom: '10px'}}>
                  <div className="grid md:grid-cols-3 gap-8 text-center w-full">
                    <div>
                      <div className="text-4xl font-bold text-blue-600 mb-2">{bookings.length}</div>
                      <div className="text-gray-600 font-medium">Total Bookings</div>
                    </div>
                    <div>
                      <div className="text-4xl font-bold text-emerald-600 mb-2" >
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </div>
                      <div className="text-gray-600 font-medium">Confirmed Trips</div>
                    </div>
                    <div>
                    </div>
                  </div>
                </div>

                {/* Bookings Grid */}
                <div className="flex flex-col gap-8" style={{ backgroundColor: "white",marginTop:"20px", width: "90%", marginLeft: "80px",paddingLeft: "10px",paddingRight: "10px",paddingTop: "10px",paddingBottom: "10px" }}>
                  {bookings.map((booking, index) => {
                    const statusConfig = getStatusConfig(booking.status);
                    return (
                      <div key={booking._id} className="group">
                        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-blue-200">
                          {/* Premium Header */}
                          <div className="relative overflow-hidden">
                            <div className={`bg-gradient-to-r ${statusConfig.color} h-2`}></div>
                            <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 px-8 py-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between"style={{marginLeft: '10px',marginRight: '10px'}}>
                                <div className="flex items-center space-x-6">
                                  <div className="relative">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${statusConfig.color} flex items-center justify-center shadow-lg`} style={{marginRight:"20px"}}>
                                      <MapPin className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center border-2 border-gray-100"style={{marginRight:"4px"}}>
                                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                    </div>
                                  </div>
                                  <div style={{marginTop:"10px"}}>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-1">
                                      {booking.packageId ? booking.packageId.name : 'Premium Travel Package'}
                                    </h3>
                                    <p className="text-gray-600 font-medium">
                                      Booking Reference: #{booking._id.slice(-8).toUpperCase()}
                                    </p>
                                  </div>
                                </div>

                                <div className={`mt-4 lg:mt-0 inline-flex items-center px-6 py-3 rounded-2xl ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border-2 font-bold text-sm shadow-lg`} style={{padding:"2px 4px"}}>
                                  {statusConfig.icon}
                                  <span className="ml-3 capitalize tracking-wide">{booking.status}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="px-8 py-8" style={{marginTop:"10px",marginBottom:"10px"}}>
                            <div className="grid lg:grid-cols-3 gap-8 mb-8"style={{marginLeft:"10px",marginRight:"10px"}}>
                              {/* Travel Date */}
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl"></div>
                                <div className="relative p-6 rounded-2xl">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl" style={{marginRight:"10px",marginLeft:"10px",padding:"1px 3px"}}>
                                      <Calendar className="w-6 h-6 text-white" style={{padding:"1px 2px"}} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1"style={{marginRight:"10px",marginLeft:"10px",marginTop:"10px"}}>Departure Date</p>
                                      <p className="text-xl font-bold text-gray-800"style={{marginRight:"10px",marginLeft:"10px"}}>
                                        {new Date(booking.travelDate).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric'
                                        })}
                                      </p>
                                      <p className="text-sm text-gray-600 font-medium"style={{marginRight:"10px",marginLeft:"10px"}}>
                                        {new Date(booking.travelDate).toLocaleDateString('en-US', {
                                          weekday: 'long'
                                        })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Investment */}
                              <div className="relative" style={{marginTop:"10px"}}>
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl"></div>
                                <div className="relative p-6 rounded-2xl">
                                  <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl" style={{marginRight:"10px",marginLeft:"10px",padding:"1px 3px"}}>
                                      <CreditCard className="w-6 h-6 text-white" style={{padding:"1px 2px"}} />
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1" style={{marginRight:"10px",marginLeft:"10px",marginTop:"10px"}}>Total Investment</p>
                                      <p className="text-2xl font-bold text-emerald-600" style={{marginRight:"10px",marginLeft:"10px"}}>
                                        ₹{booking.totalPrice.toLocaleString('en-IN')}
                                      </p>
                                      <p className="text-sm text-gray-600 font-medium" style={{marginRight:"10px",marginLeft:"10px"}}>All inclusive</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action */}
                              <div className="flex items-center justify-center">
                                {booking.status !== 'cancelled' ? (
                                  <button
                                    onClick={() => handleCancelBooking(booking._id)}
                                    className=" py-4 px-6 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center space-x-3 group"
                                    style={{padding:"4px 6px"}}
                                  >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                    <span>Cancel Journey</span>
                                  </button>
                                ) : (
                                  <div className="py-4 px-6 bg-gray-100 text-gray-500 rounded-2xl font-bold flex items-center justify-center space-x-3" style={{padding:"4px 6px"}}>
                                    <X className="w-5 h-5" />
                                    <span>Journey Cancelled</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-12 w-full">
          <div
            className="max-w-7xl mx-auto py-12 px-4 flex flex-col items-center w-full"
            style={{
              marginLeft: "50px",
              marginRight: "50px",
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            {/* Destinex Logo Centered */}
            <div className="mb-6 flex flex-col items-center" style={{marginTop: "20px"}}>
              <img
                src="/images/logo.png"
                alt="Destinex Logo"
                className="h-12 w-auto mb-2"
              />
              <h2 className="text-2xl font-bold tracking-wide">Destinex</h2>
              <p className="text-gray-400 text-sm mt-2 text-center max-w-xs">
                Explore the world with confidence and comfort.
              </p>
            </div>
            {/* Footer Links and Socials */}
            <div className="w-full flex flex-col md:flex-row justify-center md:justify-between items-center gap-8 mt-8">
              {/* Quick Links */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <h3 className="font-semibold mb-2">Quick Links</h3>
                <button 
                  onClick={handleHomeClick}
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none text-left p-0"
                >
                  Home
                </button>
                <button 
                  className="text-gray-300 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none text-left p-0"
                >
                  Contact
                </button>
              </div>
              {/* Contact Info */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <h3 className="font-semibold mb-2">Contact</h3>
                <span className="text-gray-300">info@destinex.com</span>
                <span className="text-gray-300">+91 12345 67890</span>
              </div>
              {/* Socials */}
              <div className="flex flex-col items-center md:items-start gap-2">
                <h3 className="font-semibold mb-2">Follow Us</h3>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                </div>
              </div>
            </div>
            {/* Copyright Bar */}
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm w-full">
              <p>Destinex © 2025. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Bookings;