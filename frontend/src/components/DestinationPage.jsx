import React from 'react';
import { useParams } from 'react-router-dom';
import './DestinationPage.css';

const cityData = {
  Goa: {
    hotels: [
      { name: "Hotel 1 in Goa", image: "/images/hotel1.jpg", rating: 4.5, price: 2000 },
      { name: "Hotel 2 in Goa", image: "/images/hotel2.jpg", rating: 4.0, price: 1500 }
    ],
    places: [
      { name: "Beach Paradise", image: "/images/beach1.jpg" },
      { name: "Old Fort", image: "/images/fort.jpg" }
    ]
  },
  Rishikesh: {
    hotels: [
      { name: "River View Retreat", image: "/images/rishikesh1.jpg", rating: 4.6, price: 1800 },
      { name: "Yoga Stay", image: "/images/rishikesh2.jpg", rating: 4.3, price: 1200 }
    ],
    places: [
      { name: "Lakshman Jhula", image: "/images/lakshman.jpg" },
      { name: "Triveni Ghat", image: "/images/triveni.jpg" }
    ]
  },
  Jaipur: {
    hotels: [
      { name: "Hawa Mahal Inn", image: "/images/jaipur1.jpg", rating: 4.7, price: 2100 },
      { name: "Pink City Stay", image: "/images/jaipur2.jpg", rating: 4.1, price: 1700 }
    ],
    places: [
      { name: "Hawa Mahal", image: "/images/hawa.jpg" },
      { name: "Amber Fort", image: "/images/amber.jpg" }
    ]
  }
};

function DestinationPage() {
  const { cityName } = useParams();
  const city = cityData[cityName] || { hotels: [], places: [] };

  return (
    <div className="destination-container">
      <h1>Welcome to {cityName}</h1>

      <h2>Popular Hotels</h2>
      <div className="card-grid">
        {city.hotels.map((hotel, index) => (
          <div key={index} className="card">
            <img src={hotel.image} alt={hotel.name} className="card-img" />
            <div className="card-content">
              <h3>{hotel.name}</h3>
              <p>⭐ {hotel.rating} &nbsp; • ₹{hotel.price}/night</p>
              <button className="book-btn">Book Now</button>
            </div>
          </div>
        ))}
      </div>

      <h2>Famous Places</h2>
      <div className="card-grid">
        {city.places.map((place, index) => (
          <div key={index} className="card">
            <img src={place.image} alt={place.name} className="card-img" />
            <div className="card-content">
              <h3>{place.name}</h3>
              <button className="explore-btn">Explore</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DestinationPage;
