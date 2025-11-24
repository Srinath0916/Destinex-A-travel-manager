const destinationSchema = require('../db/models/destinationModel');
const Package = require('../db/models/packageModel');

const createPlaces = async(req, res) => {
    try {
        const { name, description, image, location, latitude, longitude, rating, reviews, category, groupTypes } = req.body;
        const newDestination = new destinationSchema({
            name,
            description,
            image,
            location,
            latitude,
            longitude,
            rating,
            reviews,
            category,
            groupTypes: groupTypes || ['Couple', 'Family', 'Friends', 'Solo'] // Default to all group types if not specified
        });
        await newDestination.save();
        res.status(201).json({ message: 'Destination created successfully', data: newDestination });
    } catch (error) {
        res.status(500).json({ message: 'Error creating destination', error: error.message });
    }
}

const getAllPlaces = async (req, res) => {
    try {
        const destinations = await destinationSchema.find({ isDeleted: false });
        res.status(200).json({ message: 'Destinations fetched successfully', data: destinations });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
}

const getPlaceById = async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await destinationSchema.findById(id);
        if (!destination || destination.isDeleted) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        res.status(200).json({ message: 'Destination fetched successfully', data: destination });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching destination', error: error.message });
    }
}

const updatePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, location, latitude, longitude, rating, reviews, category, groupTypes } = req.body;
        const destination = await destinationSchema.findById(id);
        if (!destination || destination.isDeleted) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        destination.name = name || destination.name;
        destination.description = description || destination.description;
        destination.image = image || destination.image;
        destination.location = location || destination.location;
        destination.latitude = latitude || destination.latitude;
        destination.longitude = longitude || destination.longitude;
        destination.rating = rating || destination.rating;
        destination.reviews = reviews || destination.reviews;
        destination.category = category || destination.category;
        destination.groupTypes = groupTypes || destination.groupTypes;
        await destination.save();
        res.status(200).json({ message: 'Destination updated successfully', data: destination });
    } catch (error) {
        res.status(500).json({ message: 'Error updating destination', error: error.message });
    }
}

const deletePlace = async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await destinationSchema.findById(id);
        if (!destination || destination.isDeleted) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        destination.isDeleted = true;
        await destination.save();
        res.status(200).json({ message: 'Destination deleted successfully', data: destination });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting destination', error: error.message });
    }
}

const getPlacesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const destinations = await destinationSchema.find({ category, isDeleted: false });
        if (destinations.length === 0) {
            return res.status(404).json({ message: 'No destinations found for this category' });
        }
        res.status(200).json({ message: 'Destinations fetched successfully', data: destinations });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
}
const getPlacesByLocation = async (req, res) => {
    try {
        const { location } = req.params;
        const destinations = await destinationSchema.find({ location, isDeleted: false });  
        if (destinations.length === 0) {
            return res.status(404).json({ message: 'No destinations found for this location' });
        }
        res.status(200).json({ message: 'Destinations fetched successfully', data: destinations });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
}
const getPlacesByRating = async (req, res) => {
    try {
        const { rating } = req.params;
        const destinations = await destinationSchema.find({ rating, isDeleted: false });
        if (destinations.length === 0) {
            return res.status(404).json({ message: 'No destinations found for this rating' });
        }
        res.status(200).json({ message: 'Destinations fetched successfully', data: destinations });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
}
const getPlacesByName = async (req, res) => {
    try {
        const { name } = req.params;
        const destinations = await destinationSchema.find({ name, isDeleted: false });
        if (destinations.length === 0) {
            return res.status(404).json({ message: 'No destinations found for this name' });
        }
        res.status(200).json({ message: 'Destinations fetched successfully', data: destinations });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
}
const getPlacesByLocationAndCategory = async (req, res) => {
    try {
        const { location, category } = req.params;
        const destinations = await destinationSchema.find({ location, category, isDeleted: false });
        if (destinations.length === 0) {
            return res.status(404).json({ message: 'No destinations found for this location and category' });
        }
        res.status(200).json({ message: 'Destinations fetched successfully', data: destinations });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
}
const getPlacesByLocationAndRating = async (req, res) => {
    try {
        const { location, rating } = req.params;
        const destinations = await destinationSchema.find({ location, rating, isDeleted: false });
        if (destinations.length === 0) {
            return res.status(404).json({ message: 'No destinations found for this location and rating' });
        }
        res.status(200).json({ message: 'Destinations fetched successfully', data: destinations });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
}
const getPlacesByNameAndCategory = async (req, res) => {
    try {
        const { name, category } = req.params;
        const destinations = await destinationSchema.find({ name, category, isDeleted: false });
        if (destinations.length === 0) {
            return res.status(404).json({ message: 'No destinations found for this name and category' });
        }
        res.status(200).json({ message: 'Destinations fetched successfully', data: destinations });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
}

// Get all unique cities (locations)
const getAllCities = async (req, res) => {
    try {
        const cities = await destinationSchema.distinct('location', { isDeleted: false });
        res.status(200).json({ message: 'Cities fetched successfully', data: cities });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cities', error: error.message });
    }
};

// Get packages for a destination (RESTful)
const getPackagesByDestinationId = async (req, res) => {
  try {
    const { destinationId } = req.params;
    const packages = await Package.find({ destination: destinationId, isDeleted: false });
    res.status(200).json({ message: 'Packages fetched successfully', data: packages });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching packages', error: error.message });
  }
};

const getPlacesByGroupType = async (req, res) => {
    try {
        const { groupType } = req.params;
        const destinations = await destinationSchema.find({ groupTypes: groupType, isDeleted: false });
        res.status(200).json({ 
            message: destinations.length > 0 ? 'Destinations fetched successfully' : 'No destinations found for this group type',
            data: destinations 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching destinations', error: error.message });
    }
}

const getPopularDestinations = async (req, res) => {
    try {
        // Get destinations with rating >= 4 and sort by number of reviews
        const destinations = await destinationSchema.find({ 
            rating: { $gte: 4 },
            isDeleted: false 
        }).sort({ reviews: -1 }).limit(8);
        
        res.status(200).json({ 
            message: 'Popular destinations fetched successfully', 
            data: destinations 
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching popular destinations', 
            error: error.message 
        });
    }
};

module.exports = {
    createPlaces,
    getAllPlaces,
    getPlaceById,
    updatePlace,
    deletePlace,
    getPlacesByCategory,
    getPlacesByLocation,
    getPlacesByRating,
    getPlacesByName,
    getPlacesByLocationAndCategory,
    getPlacesByLocationAndRating,
    getPlacesByNameAndCategory,
    getAllCities,
    getPackagesByDestinationId,
    getPlacesByGroupType,
    getPopularDestinations
}
