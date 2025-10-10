import { createTrip, getTrips, getTripById, updateTrip } from "../controllers/trip.controller.js";
import express from "express";
const router = express.Router();

//create a new trip route
router.post('/create-trip', createTrip);

//get all trips route
router.get('/', getTrips);

//get trip by id route
router.get('/:id', getTripById);

//update trip details route
router.put('/:id', updateTrip);


export default router;