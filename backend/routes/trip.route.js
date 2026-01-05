import { 
  createTrip, 
  getTrips, 
  getTripById, 
  updateTrip, 
  addMember, 
  removeMember, 
  deleteTrip,
  generateInviteLink,
  acceptInvite,
} from "../controllers/trip.controller.js";
import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(isAuthenticated);

// Create a new trip/group
router.post('/create-trip', createTrip);

// Get all trips for logged-in user
router.get('/', getTrips);

// Get trip by id
router.get('/:id', getTripById);

// Update trip details (creator only)
router.put('/:id', updateTrip);

// Add member to trip (creator only)
router.post('/:id/add-member', addMember);

// Remove member from trip (creator only)
router.delete('/:id/remove-member/:memberId', removeMember);

// Generate invite link (creator only)
router.post('/:id/generate-invite', generateInviteLink);

// Accept invite and join group
router.post('/accept-invite/:token', acceptInvite);

// Delete a trip (creator only)
router.delete('/:id', deleteTrip);

export default router;