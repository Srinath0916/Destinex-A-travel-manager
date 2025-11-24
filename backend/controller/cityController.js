const City = require('../db/models/cityModel');
const Destination = require('../db/models/destinationModel');

// Get all cities
const getAllCities = async (req, res) => {
  try {
    const cities = await City.find().limit(9);
    res.status(200).json({ message: 'Cities fetched successfully', data: cities });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities', error: error.message });
  }
};

// Get destinations for a city
const mongoose = require('mongoose');

const getDestinationsByCity = async (req, res) => {
  const { cityId } = req.params;


  if (!mongoose.Types.ObjectId.isValid(cityId)) {
    console.log("Invalid city ID:", cityId);
    return res.status(400).json({ message: 'Invalid city ID format' });
  }

  try {
    const destinations = await Destination.find({ city: cityId, isDeleted: false });
   
    res.status(200).json({ message: 'Destinations fetched successfully', data: destinations });
  } catch (error) {
    
    res.status(500).json({ message: 'Error fetching destinations', error: error.message });
  }
};


module.exports = {
  getAllCities,
  getDestinationsByCity,
}; 