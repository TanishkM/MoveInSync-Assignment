require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
const Trip = require("../models/tripSchema");
const isLoggedIn = async (req, res, next) => {
  
  try {
      const token = req.headers.authorization;
      if (!token) {
          return res.status(403).send({
              message: "Log In Required.",
              success: false,
          });
      }
      
      const decodedToken = jwt.verify(token, JWT_SECRET);
      
      
      const user = await User.findOne({ email: decodedToken.email });
      if (!user) {
          return res.status(403).send({
              message: "User not found.",
              success: false,
          });
      }
      
      req.body.email = user.email;
      req.body.username = user.username;
      req.body.isTraveler = user.isTraveler;
      req.body.isTravelerC = user.isTravelerC;
      req.body.isAdmin = user.isAdmin;
      
      next();
  } catch (error) {
      res.status(403).send({
          message: "Authentication failed / Invalid Token",
          success: false,
      });
  }
};

const isTraveler = (req, res, next) => {
  try {
    if(!req.body.isTraveler){
      return res.status(401).send({
        message: "You don't have the required permissions.",
        success: false,
      });
    }
    next();
  } catch (error) {
    res.status(403).send({
      message: "Authentication failed",
      success: false,
    });
  }
};
const isTravelerC = (req, res, next) => {
  try {
    if(!req.body.isTravelerC){
      return res.status(401).send({
        message: "You don't have the required permissions.",
        success: false,
      });
    }
    next();
  } catch (error) {
    res.status(403).send({
      message: "Authentication failed",
      success: false,
    });
  }
};
const isAdmin = (req, res, next) => {
  try {
    if(!req.body.isAdmin){
      return res.status(401).send({
        message: "You don't have the required permissions.",
        success: false,
      });
    }
    next();
  } catch (error) {
    res.status(403).send({
      message: "Authentication failed",
      success: false,
    });
  }
};

const checkTravelerCompanion = async (req, res, next) => {
  const { username } = req.body;
  const { tripId } = req.params;

  try {
    
    const trip = await Trip.findById(tripId);
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found', success: false, data: null });
    }

    
    if (!trip.travelCompanions.includes(username)) {
      return res.status(403).json({ message: 'You are not authorized to perform this action', success: false, data: null });
    }

    
    next();
  } catch (error) {
    console.error('Error checking traveler companion:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};


const checkUsernameMatch = async (req, res, next) => {
  const { tripId, username } = req.body;

  try {
    
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found', success: false, data: null });
    }

    
    if (trip.username !== username && trip.travelCompanions.indexOf(username) === -1) {
      return res.status(403).json({ message: 'Unauthorized', success: false, data: null });
    }

    
    next();
  } catch (error) {
    console.error('Error checking username match:', error);
    res.status(500).json({ message: 'Internal Server Error', success: false, data: null });
  }
};

module.exports ={isLoggedIn,isTraveler,isTravelerC,isAdmin,checkTravelerCompanion,checkUsernameMatch}