const express = require('express');
const router = express.Router();
const { isLoggedIn,isAdmin } = require('../middleware/authMiddleware');
const {viewRidesForUsername,viewFeedbackForUsername, viewAllFeedback, viewAllRides } = require('../controllers/adminController');
router.post('/viewRidesForUsername',isLoggedIn,isAdmin,viewRidesForUsername);
router.post('/viewFeedbackForUsername',isLoggedIn,isAdmin,viewFeedbackForUsername);
router.get('/viewAllRides',isLoggedIn,isAdmin,viewAllRides);
router.get('/viewAllFeedback',isLoggedIn,isAdmin,viewAllFeedback);
module.exports = router;
