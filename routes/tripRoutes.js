const express = require('express');
const router = express.Router();
const { isLoggedIn, checkUsernameMatch, checkTravelerCompanion } = require('../middleware/authMiddleware');
const { createTrip, viewTrip, viewAudit, updateCurrentLocation, addFeedbackToTrip, getNotification } = require('../controllers/tripController');
const { isTraveler,isTravelerC } = require('../middleware/authMiddleware');

router.post('/createTrip',isLoggedIn,isTraveler,createTrip);
router.get('/viewTrip/:tripId',  isLoggedIn,isTravelerC,checkTravelerCompanion,viewTrip);
router.get('/viewAudit',isLoggedIn,isTraveler,viewAudit);
router.post('/updateCurLocation',isLoggedIn,isTraveler,updateCurrentLocation);
router.post('/addFeedbackToTrip',isLoggedIn,checkUsernameMatch,addFeedbackToTrip);
router.get('/getNotification',isLoggedIn,getNotification);
module.exports = router;