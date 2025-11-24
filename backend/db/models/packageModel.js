const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    inclusions: [{
        type: String,
        required: true
    }],
    exclusions: [{
        type: String,
        required: true
    }],
    itinerary: [{
        day: Number,
        description: String,
        activities: [String]
    }],
    category: {
        type: String,
        required: true
    },
    groupType: {
        type: String,
        enum: ['Family', 'Solo', 'Couple', 'Friends'],
        required: true
    },
    maxGroupSize: {
        type: Number,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Challenging', 'Difficult'],
        required: true
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Package', packageSchema); 