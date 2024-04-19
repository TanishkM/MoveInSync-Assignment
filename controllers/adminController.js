const Trip = require('../models/tripSchema');
const viewRidesForUsername = async (req, res) => {
  const { targetUsername } = req.body;

  try {
    
    const trips = await Trip.find({ 'username': targetUsername});

    res.status(200).json({ message: 'Rides retrieved successfully', success: true, data: trips });
  } catch (error) {
    console.error('Error retrieving rides:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};

const viewFeedbackForUsername = async (req, res) => {
  const { targetUsername } = req.body;

  try {
    const feedbacks = await Trip.aggregate([
      
      { $match: { 'feedbacks.username': targetUsername } },
      
      { $unwind: '$feedbacks' },
      
      { $match: { 'feedbacks.username': targetUsername } },
      
      {
        $group: {
          _id: '$_id',
          feedbacks: { $push: '$feedbacks' }
        }
      }
    ]);

    
    const extractedFeedbacks = feedbacks.map(trip => trip.feedbacks).flat();

    res.status(200).json({ message: 'Feedback retrieved successfully', success: true, data: extractedFeedbacks });
  } catch (error) {
    console.error('Error retrieving feedback:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};
const viewAllRides = async (req, res) => {
  try {
    
    const trips = await Trip.find();

    res.status(200).json({ message: 'All rides retrieved successfully', success: true, data: trips });
  } catch (error) {
    console.error('Error retrieving all rides:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};
const viewAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Trip.aggregate([
      
      { $unwind: '$feedbacks' },
      
      {
        $group: {
          _id: '$_id',
          feedbacks: { $push: '$feedbacks' }
        }
      }
    ]);

    
    const extractedFeedbacks = feedbacks.map(trip => trip.feedbacks).flat();

    res.status(200).json({ message: 'All feedbacks retrieved successfully', success: true, data: extractedFeedbacks });
  } catch (error) {
    console.error('Error retrieving all feedbacks:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
}

module.exports = { viewRidesForUsername,viewFeedbackForUsername,viewAllRides,viewAllFeedback };
