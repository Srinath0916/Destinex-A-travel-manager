import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import './PackagePlanner.css';

const PackagePlanner = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    adults: 1,
    children: 0,
    travelDate: '',
    specialRequirements: ''
  });
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    // Fetch package details
    axios.get(`/packages/${packageId}`)
      .then(res => {
        setPackageDetails(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching package:', err);
        toast.error('Failed to load package details');
        setError('Failed to load package details');
        setLoading(false);
      });
  }, [packageId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'travelDate') {
      const selectedDate = new Date(value);
      const today = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(today.getFullYear() + 1);

      // Reset time part for accurate date comparison
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setDateError('Travel date cannot be in the past');
        toast.error('Travel date cannot be in the past');
        return;
      } else if (selectedDate > oneYearFromNow) {
        setDateError('Travel date cannot be more than 1 year in advance');
        toast.error('Travel date cannot be more than 1 year in advance');
        return;
      } else {
        setDateError('');
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateTotalCost = () => {
    if (!packageDetails) return 0;
    const adultCost = packageDetails.price * formData.adults;
    const childCost = (packageDetails.price * 0.5) * formData.children;
    return adultCost + childCost;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    try {
      console.log('Current user data:', user); // Debug log
      
      // Check for user ID in both possible formats
      const userId = user._id || user.userId;
      if (!userId) {
        console.error('User data structure:', user); // Debug log
        toast.error('User ID not found. Please log in again.');
        throw new Error('User ID not found. Please log in again.');
      }

      const bookingData = {
        userId: userId,
        packageId: packageId,
        destinationId: packageDetails.destination,
        adults: formData.adults,
        children: formData.children,
        travelDate: formData.travelDate,
        specialRequirements: formData.specialRequirements,
        groupType: 'Family', // Default group type
        duration: packageDetails.duration, // Use package duration
        totalAmount: calculateTotalCost(),
        status: 'pending'
      };

      console.log('Sending booking data:', bookingData); // Debug log

      const response = await axios.post('/booking/bookings', bookingData);
      
      if (response.data) {
        toast.success('Booking created successfully!');
        navigate(`/payment/${packageId}`, {
          state: {
            bookingDetails: {
              ...formData,
              totalCost: calculateTotalCost(),
              packageDetails,
              bookingId: response.data.booking._id
            }
          }
        });
      }
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || err.message || 'Failed to create booking. Please try again.');
      setError(err.response?.data?.message || err.message || 'Failed to create booking. Please try again.');
    }
  };

  const handleBackClick = () => {
    navigate(`/package/${packageId}`);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!packageDetails) return <div className="text-center py-10">Package not found</div>;

  return (
    <div className="planner-page">
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
      <div className="planner-header">
        <div className="header-content">
          <button onClick={handleBackClick} className="back-button">
            BACK
          </button>
          <div className="header-title-section">
            <h1 className="header-main-title">
              Book Your <span className="highlight">Experience</span>
            </h1>
            <p className="header-subtitle">Complete your booking with confidence and security</p>
          </div>
        </div>
      </div>

      {/* Main Package Title Section */}
      <div className="package-title-section">
        <h2>Book Your {packageDetails.name} Experience</h2>
      </div>
      
      <div className="booking-form">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Adults</label>
              <input
                type="number"
                name="adults"
                min="1"
                value={formData.adults}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number of Children</label>
              <input
                type="number"
                name="children"
                min="0"
                value={formData.children}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Travel Date</label>
            <input
              type="date"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${dateError ? 'border-red-500' : ''}`}
              required
              min={new Date().toISOString().split('T')[0]}
              max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]}
            />
            {dateError && (
              <p className="mt-1 text-sm text-red-600">{dateError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Special Requirements</label>
            <textarea
              name="specialRequirements"
              value={formData.specialRequirements}
              onChange={handleInputChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 text-black">Cost Breakdown</h3>
            <div className="mt-2 space-y-2">
              <p className="text-gray-600 text-black">
                Adults ({formData.adults}): ₹{packageDetails.price * formData.adults}
              </p>
              {formData.children > 0 && (
                <p className="text-gray-600 text-black">
                  Children ({formData.children}): ₹{(packageDetails.price * 0.5) * formData.children}
                </p>
              )}
              <p className="text-lg font-bold text-gray-900 text-black">
                Total: ₹{calculateTotalCost()}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-green-600 transition font-semibold"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default PackagePlanner;