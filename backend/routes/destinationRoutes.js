const express = require('express');
const router = express.Router();
const destinationController = require('../controller/destinationController');

// Create
router.post('/places/add', destinationController.createPlaces);

// Filters (specific routes first)
router.get('/places/group-type/:groupType', destinationController.getPlacesByGroupType);
router.get('/places/category/:category', destinationController.getPlacesByCategory);
router.get('/places/location/:location', destinationController.getPlacesByLocation);
router.get('/places/rating/:rating', destinationController.getPlacesByRating);
router.get('/places/name/:name', destinationController.getPlacesByName);
router.get('/places/popular', destinationController.getPopularDestinations);

// Combined Filters
router.get('/places/location/:location/category/:category', destinationController.getPlacesByLocationAndCategory);
router.get('/places/location/:location/rating/:rating', destinationController.getPlacesByLocationAndRating);
router.get('/places/name/:name/category/:category', destinationController.getPlacesByNameAndCategory);

// Read (general routes last)
router.get('/places', destinationController.getAllPlaces);
router.get('/places/:id', destinationController.getPlaceById);

// Update
router.put('/places/:id', destinationController.updatePlace);

// Delete (soft delete)
router.delete('/places/:id', destinationController.deletePlace);

// Get all unique cities (locations)
router.get('/cities', destinationController.getAllCities);

// RESTful: Get packages for a destination
router.get('/destinations/:destinationId/packages', destinationController.getPackagesByDestinationId);

module.exports = router;
