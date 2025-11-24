import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';

const categories = ['Luxury', 'Adventure', 'Budget', 'Popular', 'Romantic', 'Modern'];
const ratings = [5, 4, 3, 2];
const prices = [1000, 500, 200]; // example thresholds

const FilterSection = ({ setDestinations }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  const fetchFilteredData = async () => {
    try {
      let url = '/destination/places';

      if (selectedCategory && selectedRating) {
        url = `/destination/places/category/${selectedCategory}/rating/${selectedRating}`;
      } else if (selectedCategory) {
        url = `/destination/places/category/${selectedCategory}`;
      } else if (selectedRating) {
        url = `/destination/places/rating/${selectedRating}`;
      }

      const res = await axios.get(url);
      const data = Array.isArray(res.data) ? res.data : res.data.data;
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching filtered destinations:', error);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, [selectedCategory, selectedRating]);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto md:mx-0">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Filter Destinations</h2>

      {/* Category Filter */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="block w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Rating Filter */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
        <select
          value={selectedRating}
          onChange={(e) => setSelectedRating(e.target.value)}
          className="block w-full mt-1 rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition"
        >
          <option value="">All Ratings</option>
          {ratings.map((rate) => (
            <option key={rate} value={rate}>{rate} stars & up</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterSection;
