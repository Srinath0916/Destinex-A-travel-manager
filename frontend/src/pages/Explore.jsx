import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import FilterSection from '../pages/FilterSection';

const Explore = () => {
  const [step, setStep] = useState(1); // 1: cities, 2: destinations, 3: packages
  const [cities, setCities] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all cities on mount
  useEffect(() => {
    setLoading(true);
    axios.get('/cities')
      .then(res => {
        setCities(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch cities');
        setLoading(false);
      });
  }, []);

  // Fetch destinations for selected city
  const handleCityClick = (city) => {
    setSelectedCity(city);
    setStep(2);
    setLoading(true);
    axios.get(`/cities/${city._id}/destinations`)
      .then(res => {
        setDestinations(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch destinations');
        setLoading(false);
      });
  };

  // Fetch packages for selected destination
  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination);
    setStep(3);
    setLoading(true);
    axios.get(`/destination/destinations/${destination._id}/packages`)
      .then(res => {
        setPackages(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch packages');
        setLoading(false);
      });
  };

  // Book Now
  const handleBookNow = (pkg) => {
    navigate(`/booking/${pkg._id}`);
  };

  // Breadcrumbs
  const handleBreadcrumb = (toStep) => {
    setStep(toStep);
    if (toStep === 1) {
      setSelectedCity(null);
      setSelectedDestination(null);
      setDestinations([]);
      setPackages([]);
    } else if (toStep === 2) {
      setSelectedDestination(null);
      setPackages([]);
    }
  };

  // Card image fallback
  const getImageSrc = (imageString) => {
    if (!imageString) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imageString.startsWith('data:image/')) return imageString;
    if (imageString.startsWith('http')) return imageString;
    return `data:image/jpeg;base64,${imageString}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 p-8 flex flex-col items-center">
      {/* Breadcrumbs */}
      <nav className="w-full max-w-6xl mb-8">
        <ol className="flex flex-wrap gap-2 text-lg text-blue-700 font-medium">
          <li className={`cursor-pointer ${step > 1 ? 'hover:underline' : ''}`} onClick={() => handleBreadcrumb(1)}>Cities</li>
          {step > 1 && <li>/</li>}
          {step > 1 && (
            <li className={`cursor-pointer ${step > 2 ? 'hover:underline' : ''}`} onClick={() => handleBreadcrumb(2)}>{selectedCity?.name || 'Destinations'}</li>
          )}
          {step > 2 && <li>/</li>}
          {step > 2 && (
            <li className="text-gray-700">{selectedDestination?.name || 'Packages'}</li>
          )}
        </ol>
      </nav>

      {/* Main Content */}
      <div className="w-full max-w-6xl">
        {loading && <div className="text-center py-10 text-xl text-blue-500 animate-pulse">Loading...</div>}
        {error && <div className="text-center py-10 text-red-500">{error}</div>}

        {/* Step 1: Cities */}
        {!loading && step === 1 && (
          <div>
            <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Explore Cities</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {cities.map(city => (
                <div
                  key={city._id}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer flex flex-col items-center p-6 group border border-blue-100 hover:border-blue-300"
                  onClick={() => handleCityClick(city)}
                >
                  <img src="/images/city-placeholder.jpg" alt={city.name} className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-blue-200 group-hover:border-blue-400 transition" />
                  <h2 className="text-2xl font-semibold text-blue-700 mb-2 group-hover:text-blue-900">{city.name}</h2>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Destinations */}
        {!loading && step === 2 && (
          <div>
            <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Tourist Destinations in {selectedCity?.name}</h1>
            {destinations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {destinations.map(dest => (
                  <div
                    key={dest._id}
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer flex flex-col items-center p-6 group border border-green-100 hover:border-green-300"
                    onClick={() => handleDestinationClick(dest)}
                  >
                    <img src={getImageSrc(dest.image)} alt={dest.name} className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-green-200 group-hover:border-green-400 transition" />
                    <h2 className="text-2xl font-semibold text-green-700 mb-2 group-hover:text-green-900">{dest.name}</h2>
                    <p className="text-gray-500 text-center text-sm line-clamp-2">{dest.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-lg">No destinations found for this city.</div>
            )}
          </div>
        )}

        {/* Step 3: Packages */}
        {!loading && step === 3 && (
          <div>
            <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">Packages for {selectedDestination?.name}</h1>
            {packages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {packages.map(pkg => (
                  <div
                    key={pkg._id}
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-transform transform hover:-translate-y-1 cursor-pointer flex flex-col items-center p-6 group border border-pink-100 hover:border-pink-300"
                  >
                    <img src={getImageSrc(pkg.image)} alt={pkg.name} className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-pink-200 group-hover:border-pink-400 transition" />
                    <h2 className="text-2xl font-semibold text-pink-700 mb-2 group-hover:text-pink-900">{pkg.name}</h2>
                    <p className="text-gray-500 text-center text-sm line-clamp-2">{pkg.description}</p>
                    <p className="text-gray-800 font-bold mb-2">₹{pkg.price}</p>
                    <button
                      className="mt-auto bg-gradient-to-r from-pink-500 to-blue-500 text-white px-4 py-2 rounded hover:from-blue-600 hover:to-pink-600 transition font-semibold shadow"
                      onClick={() => handleBookNow(pkg)}
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-lg">No packages found for this destination.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
