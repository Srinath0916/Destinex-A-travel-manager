import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/destination/cities')
      .then(res => {
        setCities(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch cities');
        setLoading(false);
      });
  }, []);

  const handleCityClick = (city) => {
    navigate(`/city/${city._id}/destinations`, { state: { cityName: city.name } });
  };

  if (loading) return <div className="text-center py-10">Loading cities...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-green-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Select a City</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {cities.map((city) => (
          <div
            key={city._id}
            className="bg-white rounded-xl shadow-lg p-6 text-center cursor-pointer hover:bg-blue-50 transition"
            onClick={() => handleCityClick(city)}
          >
            <span className="text-2xl font-semibold text-blue-700">{city.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityList; 