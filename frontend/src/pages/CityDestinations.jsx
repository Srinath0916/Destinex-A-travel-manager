import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const CityDestinations = () => {
  const { cityId } = useParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const cityName = location.state?.cityName || 'Selected City';

  useEffect(() => {
    axios.get(`/cities/${cityId}/destinations`)
      .then(res => {
        console.log("API response:", res);
        setDestinations(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API error:", err);
        setError('Failed to fetch destiny');
        setLoading(false);
      });
  }, [cityId]);

  const handleDestinationClick = (destinationId) => {
    navigate(`/destinations/${destinationId}/packages`);
  };

  if (loading) return <div className="text-center py-10">Loading destinations...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 to-green-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Destinations in {cityName}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {destinations.map((dest) => (
          <div
            key={dest._id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between cursor-pointer hover:bg-blue-50 transition"
            onClick={() => handleDestinationClick(dest._id)}
          >
            <img src={dest.image} alt={dest.name} className="w-full h-40 object-cover rounded mb-4" />
            <h2 className="text-2xl font-semibold text-blue-700 mb-2">{dest.name}</h2>
            <p className="text-gray-600 mb-2">{dest.description}</p>
            <p className="text-gray-800 font-bold mb-2">Rating: {dest.rating} ⭐</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityDestinations; 