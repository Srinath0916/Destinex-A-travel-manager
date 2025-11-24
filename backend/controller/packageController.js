const Package = require('../db/models/packageModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc    Create a new package
// @route   POST /api/packages
// @access  Private/Admin
const createPackage = asyncHandler(async (req, res) => {
    const newPackage = new Package(req.body);
    const createdPackage = await newPackage.save();
    res.status(201).json(createdPackage);
});

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
const getPackages = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const count = await Package.countDocuments({ ...keyword, isDeleted: false });
    const packages = await Package.find({ ...keyword, isDeleted: false })
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ packages, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid package ID format');
    }

    const packageData = await Package.findOne({ _id: id, isDeleted: false });
  

    if (packageData) {
        res.json(packageData);
    } else {
        res.status(404);
        throw new Error('Package not found');
    }
});

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/Admin
const updatePackage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid package ID format');
    }

    const pkg = await Package.findOne({ _id: id, isDeleted: false });

    if (pkg) {
        const fields = [
            'name', 'description', 'image', 'duration', 'price', 'inclusions',
            'exclusions', 'itinerary', 'category', 'maxGroupSize', 'difficulty'
        ];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                pkg[field] = req.body[field];
            }
        });

        pkg.updatedAt = Date.now();

        const updatedPackage = await pkg.save();
        res.json(updatedPackage);
    } else {
        res.status(404);
        throw new Error('Package not found');
    }
});

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
const deletePackage = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid package ID format');
    }

    const pkg = await Package.findOne({ _id: id, isDeleted: false });

    if (pkg) {
        pkg.isDeleted = true;
        await pkg.save();
        res.json({ message: 'Package removed' });
    } else {
        res.status(404);
        throw new Error('Package not found');
    }
});

// @desc    Get packages by category
// @route   GET /api/packages/category/:category
// @access  Public
const getPackagesByCategory = asyncHandler(async (req, res) => {
    const packages = await Package.find({
        category: req.params.category,
        isDeleted: false
    });
    res.json(packages);
});

// @desc    Get packages by difficulty level
// @route   GET /api/packages/difficulty/:difficulty
// @access  Public
const getPackagesByDifficulty = asyncHandler(async (req, res) => {
    const packages = await Package.find({
        difficulty: req.params.difficulty,
        isDeleted: false
    });
    res.json(packages);
});

// @desc    Get packages by destination
// @route   GET /api/packages/destination/:destinationId
// @access  Public
const getPackagesByDestination = asyncHandler(async (req, res) => {
    const { destinationId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(destinationId)) {
        res.status(400);
        throw new Error('Invalid destination ID format');
    }

    const packages = await Package.find({
        destination: destinationId,
        isDeleted: false
    });
   

    res.json(packages);
});

module.exports = {
    createPackage,
    getPackages,
    getPackageById,
    updatePackage,
    deletePackage,
    getPackagesByCategory,
    getPackagesByDifficulty,
    getPackagesByDestination,
};
