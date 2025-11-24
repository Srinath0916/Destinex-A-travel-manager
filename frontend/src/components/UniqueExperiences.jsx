import React, { useState, useEffect } from 'react';
import './UniqueExperiences.css';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const UniqueExperiences = () => {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        console.log('Fetching experiences...');
        const response = await axios.get('/destination/places?limit=30');
        console.log('API Response:', response.data);
        
        if (response.data && response.data.data) {
          console.log('All destinations:', response.data.data);
          
          // Filter for unique experiences based on actual categories
          const uniqueExperiences = response.data.data.filter(dest => {
            console.log('Checking destination:', dest.name, 'Category:', dest.category);
            return [
              'Heritage Site',
              'Historical Monument',
              'Cultural Heritage',
              'Adventure Sports',
              'Spiritual Ashram',
              'Buddhist Site',
              'Historical Fort',
              'Royal Palace'
            ].includes(dest.category);
          });
          
          console.log('Filtered unique experiences:', uniqueExperiences);
          
          // Take first 6 unique experiences
          const finalExperiences = uniqueExperiences.slice(0, 6);
          console.log('Final experiences to display:', finalExperiences);
          
          setExperiences(finalExperiences);
        } else {
          console.log('No data in response');
          setError('No destinations found');
        }
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError('Failed to load unique experiences');
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const handleClick = (destination) => {
    const path = `/planner/${destination.name.toLowerCase().replace(/\s+/g, '-')}`;
    navigate(`${path}?type=experience`);
  };

  if (loading) {
    return (
      <div className="unique-experiences">
        <h2>FOR UNIQUE EXPERIENCES</h2>
        <div className="experience-slider">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div className="card loading" key={index}>
              <div className="loading-placeholder"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="unique-experiences">
        <h2>FOR UNIQUE EXPERIENCES</h2>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="unique-experiences">
      <h2>FOR UNIQUE EXPERIENCES</h2>
      <div className="experience-slider">
        {experiences.length === 0 ? (
          <div className="error-message">No unique experiences found</div>
        ) : (
          experiences.map((experience, index) => (
            <div 
              className="card" 
              key={experience._id} 
              onClick={() => handleClick(experience)}
            >
              <img src={experience.image} alt={experience.name} />
              <div className="overlay">
                <p>{experience.category}</p>
                <h3>{experience.name}</h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UniqueExperiences;
