import React, { useEffect, useState } from 'react';
import axios from '../utils/axios';
import './PopularLoc.css';
import { useNavigate } from 'react-router-dom';

function PopularLoc({ onClose }) {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/destination/places')
      .then(res => {
        setDestinations(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load destinations');
        setLoading(false);
      });
  }, []);

  const filteredLocations = destinations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDestinationClick = (destinationId) => {
    onClose();
    navigate(`/destinations/${destinationId}/packages`);
  };

  return (
    <div className="location-popup">
      <button 
        className="close-btn" 
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      <h2 className="location-title">Pick your destination</h2>
      <input 
        type="text" 
        className="location-search text-black" 
        placeholder="Search Indian cities..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <ul className="location-list">
        {filteredLocations.map((loc, index) => (
          <li key={index} className="location-item" onClick={() => handleDestinationClick(loc._id)}>
            <span className="location-name">{loc.name}</span>
            {loc.tag && (
              <span className={`tag ${loc.tag.toLowerCase().replace(/\s+/g, '-')}`}>{loc.tag}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PopularLoc;
