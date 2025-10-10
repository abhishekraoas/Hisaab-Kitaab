const {createTrip, getTrips, getTripById, updateTrip} = require('../controllers/trip.controller');

const express = require('express');
const router = express.Router();

//create a new trip route
router.post('/create-trip', createTrip);

//get all trips route
router.get('/', getTrips);

//get trip by id route
router.get('/:id', getTripById);

//update trip details route
router.put('/:id', updateTrip);




module.exports = router;