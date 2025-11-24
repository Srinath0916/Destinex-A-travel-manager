const Razorpay = require('razorpay');
const crypto = require('crypto');
const bookingSchema = require('../db/models/bookingModel');
const mongoose = require('mongoose'); // Import mongoose

// Initialize Razorpay
// ... existing code ...

const createBooking = async (req, res) => {
    const { 
        userId, 
        packageId, 
        destinationId,
        adults,
        children,
        travelDate,
        specialRequirements,
        groupType,
        duration,
        totalAmount,
        status 
    } = req.body;

    try {
        const newBooking = new bookingSchema({
            userId,
            packageId,
            destinationId,
            numberOfPeople: (adults || 1) + (children || 0),
            totalPrice: totalAmount,
            travelDate,
            specialRequirements,
            groupType,
            duration,
            status: status || 'pending'
        });

        await newBooking.save();

        res.status(201).json({ success: true, message: 'Booking created successfully', booking: newBooking });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, message: 'Error creating booking', error: error.message });
    }
}

const getBooking = async(req, res) => {
    const {userId} = req.params;

    console.log(`Attempting to fetch bookings for userId: ${userId}`);

    if (!userId) {
        console.log('Error: userId is missing in request parameters.');
        return res.status(400).json({success : false, message : "userId is required"});
    }
    try {
            // Convert userId string to ObjectId
            const userObjectId = new mongoose.Types.ObjectId(userId);
            console.log(`Converted userId to ObjectId: ${userObjectId}`); // Added debug log

            // Use the user ID to find bookings
            const bookings = await bookingSchema.find({userId : userObjectId})
              .populate('userId')
              .populate('packageId');

            console.log(`Found ${bookings.length} bookings for userId ${userId}:`, bookings);

            if (!bookings || bookings.length === 0)  {
                console.log(`No bookings found for userId: ${userId}`);
                return res.status(404).json({success : false, message : "No booking found for this user"});
            }
            res.status(200).json({success : true, message : "Booking fetched successfully", booking : bookings});
            } catch (error) {
        console.error(`Error fetching bookings for userId ${userId}:`, error);
        res.status(500).json({success : false, message : "Error fetching booking", error : error.message});
    }
}

const updateBooking = async (req, res) => {
    const { bookingId } = req.params;
    const { status } = req.body;

    try {
        const updatedBooking = await bookingSchema.findByIdAndUpdate(bookingId, { status }, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, message: 'Booking updated successfully', booking: updatedBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating booking', error: error.message });
    }
}

const cancelBooking = async (req, res) => {
    const { bookingId } = req.params;

    try {
        const cancelledBooking = await bookingSchema.findByIdAndUpdate(
            bookingId,
            { status: 'cancelled' }, 
            { new: true }
        );

        if (!cancelledBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.status(200).json({ success: true, message: 'Booking cancelled successfully', data: cancelledBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error cancelling booking', error: error.message });
    }
};


module.exports = {
    createBooking,
    getBooking,
    updateBooking,
    cancelBooking,
}