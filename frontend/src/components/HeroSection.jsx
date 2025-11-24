import React, { useState } from 'react';
import '../App.css';
import './HeroSection.css';
import PopularLoc from './PopularLoc';

function HeroSection() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className='hero-container'>
      <video src='/videos/video-1.mp4' autoPlay loop muted />
      <h1>ADVENTURE AWAITS</h1>

      <div className='search-bar' onClick={() => setShowPopup(true)}>
        <input
          type='text'
          placeholder='Search countries, cities'
          className='search-input text-black'
          readOnly // Prevent direct typing
        />
        <i className='fas fa-search search-icon'></i>
      </div>

      {showPopup && <PopularLoc onClose={() => setShowPopup(false)} />}

      <div className='hero-btns'>
        <div className="hero-tags">
          <p>✈️ Discover new horizons • 🏔️ Explore hidden gems • 🏝️ Plan your next escape</p>
          <div className="hashtags">
            <span>#Wanderlust</span>
            <span>#ExploreTheWorld</span>
            <span>#TravelMore</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
