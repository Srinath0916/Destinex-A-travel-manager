const mongoose = require('mongoose');  

const bookingSchema = new mongoose.Schema({ 
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    destinationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: true
    },
    numberOfPeople: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    travelDate: {
        type: Date,
        required: true
    },
    specialRequirements: {
        type: String,
        default: ''
    },
    groupType: {
        type: String,
        enum: ['Couple', 'Family', 'Friends', 'Solo'],
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    cancelledAt: {
        type: Date,
        default: null
    },
    cancellationReason: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
