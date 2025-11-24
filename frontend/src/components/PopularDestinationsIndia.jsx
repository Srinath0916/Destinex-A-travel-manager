import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import './PopularDestinationsIndia.css';

const PopularDestinationsIndia = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('/destination/places/popular');
        setDestinations(response.data.data || []);
      } catch (err) {
        setError('Failed to load popular destinations');
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleClick = (destinationName) => {
    const formattedName = destinationName.toLowerCase().replace(/ /g, '-');
    navigate(`/planner/${formattedName}`);
  };

  if (loading) {
    return (
      <div className="destinations-container">
        <h2>Popular Destinations in India</h2>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="destinations-container">
        <h2>Popular Destinations in India</h2>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="destinations-container">
      <h2>Popular Destinations in India</h2>
      <div className="cards-wrapper">
        {destinations.map((place) => (
          <div className="card" key={place._id} onClick={() => handleClick(place.name)}>
            <img src={place.image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={place.name} />
            <div className="card-overlay">
              <p>{place.category?.toUpperCase() || 'EXPLORE'}</p>
              <h3>{place.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularDestinationsIndia;
