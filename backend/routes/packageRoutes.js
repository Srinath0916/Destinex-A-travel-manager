const express = require('express');
const router = express.Router();
const {
    createPackage,
    getPackages,
    getPackageById,
    updatePackage,
    deletePackage,
    getPackagesByCategory,
    getPackagesByDifficulty,
} = require('../controller/packageController'); 
// const { protect, admin } = require('../middleware/admin');          // need to add this middleware to protect the routes

// Public routes
router.route('/')
    .get(getPackages)
    .post(createPackage);

router.route('/:id')
    .get(getPackageById)
    .put( updatePackage)
    .delete( deletePackage);

router.route('/category/:category')
    .get(getPackagesByCategory);

router.route('/difficulty/:difficulty')
    .get(getPackagesByDifficulty);

router.route('/destination/:destinationId')
    .get(require('../controller/packageController').getPackagesByDestination);

module.exports = router; 