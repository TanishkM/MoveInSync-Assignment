const User = require('../models/UserSchema');
const Trip = require('../models/tripSchema');
const geofenceInKm=1;
const createTrip = async (req, res) => {
  const { username, travelCompanions, pickupLat, pickupLong, dropLat, dropLong } = req.body;
  const driverName = "Manoj Kumar", driverPhoneNumber="912321456", cabNumber="RJ14 1111";
  const curLat=pickupLat,curLong=pickupLong;
  const status="ongoing";
  try {
    
    if(travelCompanions.length)
    for (const Cusername of travelCompanions) {
        const companion = await User.findOne({ username: Cusername, isTravelerC: true });
        
        if (!companion) {
          return res.status(400).json({ message: `Travel companion ${Cusername} doesn't exist or is not a traveler companion`, success: false, data: null });
        }
      }
    
    const newTrip = new Trip({
      username,
      driverName,
      driverPhoneNumber,
      cabNumber,
      travelCompanions,
      status,
      pickupLat,
      pickupLong,
      dropLat,
      dropLong,
      curLat,
      curLong
    });
    
    if(travelCompanions.length)
    for (const Cusername of travelCompanions) {
        const companion = await User.findOne({ username: Cusername, isTravelerC: true });
        
        companion.notifications.push('Trip started');
        await companion.save();
      }
    await newTrip.save();
    const tripId = newTrip._id; // Get the trip ID
    const tripLink = `http://localhost:5000/api/trips/viewTrip/${tripId}`; 
    res.status(201).json({ message: 'Trip created successfully', success: true, data: tripLink });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};


const viewTrip = async (req, res) => {
  const { tripId } = req.params;

  try {
    
    const trip = await Trip.findById(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found', success: false, data: null });
    }

    if (trip.status === 'completed') {
      return res.status(400).json({ message: 'This link has expired because the trip is completed', success: false, data: null });
    }

    res.status(200).json({ message: 'Trip details retrieved successfully', success: true, data: {
      driverName: trip.driverName,
      driverPhoneNumber: trip.driverPhoneNumber,
      cabNumber: trip.cabNumber,
      status: trip.status,
      pickupLat: trip.pickupLat,
      pickupLong: trip.pickupLong,
      dropLat: trip.dropLat,
      dropLong: trip.dropLong,
      curLat: trip.curLat,
      curLong: trip.curLong
    } });
  } catch (error) {
    console.error('Error retrieving trip:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};


const viewAudit = async (req, res) => {
  const { username } = req.body;

  try {
    const trips = await Trip.find({ username: username });
    
    res.status(200).json({ message: 'Trips retrieved successfully', success: true, data: {
      trips: trips.map(trip => ({
        tripId: trip._id,
        driverName: trip.driverName,
        driverPhoneNumber: trip.driverPhoneNumber,
        cabNumber: trip.cabNumber,
        status: trip.status,
        pickupLat: trip.pickupLat,
        pickupLong: trip.pickupLong,
        dropLat: trip.dropLat,
        dropLong: trip.dropLong,
        curLat: trip.curLat,
        curLong: trip.curLong
      }))
    } });
  } catch (error) {
    console.error('Error retrieving trips:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};


const updateCurrentLocation = async (req, res) => {
  function calculateDistance(coord1, coord2) {
    
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }

    
    var lat1 = parseFloat(coord1.latitude);
    var lon1 = parseFloat(coord1.longitude);
    var lat2 = parseFloat(coord2.latitude);
    var lon2 = parseFloat(coord2.longitude);

    
    var R = 6371;

    
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);

    
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var distance = R * c; 
    return distance;
  }

  const { username, curLat, curLong } = req.body;

  try {
    
    const trip = await Trip.findOne({ username, status: 'ongoing' });

    
    if (!trip) {
      return res.status(404).json({ message: 'Ongoing trip not found for user', success: false, data: null });
    }

    
    if (trip.username !== username) {
      return res.status(403).json({ message: 'You do not have permission to perform this operation', success: false, data: null });
    }

    
    trip.curLat = curLat;
    trip.curLong = curLong;

    
    if (
      calculateDistance({ latitude: trip.dropLat, longitude: trip.dropLong }, { latitude: curLat, longitude: curLong }) < geofenceInKm &&
      trip.reachedNearL=== false
    ) {
      trip.reachedNearL = true;
      if(travelCompanions.length)
    for (const Cusername of travelCompanions) {
        const companion = await User.findOne({ username: Cusername, isTravelerC: true });
        companion.notifications.push('You are within 1 km of your destination');
        await companion.save();
      }
    }

    if (trip.curLat === trip.dropLat && trip.curLong === trip.dropLong) {
      trip.status = 'completed';
      if(travelCompanions.length)
      for (const Cusername of travelCompanions) {
        const companion = await User.findOne({ username: Cusername, isTravelerC: true });
        companion.notifications.push('Trip completed successfully');
        await companion.save();
      }
    }
    
    await trip.save();

    res.status(200).json({ message: 'Current location updated successfully', success: true, data: trip });
  } catch (error) {
    console.error('Error updating current location:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};




const addFeedbackToTrip = async (req, res) => {
  const { tripId, username, feedback } = req.body;
  console.log(tripId,username,feedback)
  try {
    
    const trip = await Trip.findById(tripId);
    
    trip.feedbacks.push({ username, feedback });
    
    await trip.save();

    res.status(200).json({ message: 'Feedback added successfully', success: true, data: trip });
  } catch (error) {
    console.error('Error adding feedback to trip:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};
const getNotification = async (req, res) => {
  const { username } = req.body;

  try {
    
    const user = await User.findOne({ username });
    
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    
    return res.status(200).json({ success: true, notifications: user.notifications });
  } catch (error) {
    console.error('Error retrieving notifications:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = { createTrip, viewTrip, viewAudit ,updateCurrentLocation,addFeedbackToTrip,getNotification};

