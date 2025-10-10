import tripModel from "../models/trip.model.js";

// Create a new trip
const createTrip = async (req, res) => {
  const { tripName, createdBy, members } = req.body;
  if (!tripName || !createdBy) {
    return res
      .status(400)
      .json({ message: "Trip name and creator are required." });
  }
  try {
    const newTrip = new tripModel({ tripName, createdBy, members });
    await newTrip.save();
    res
      .status(201)
      .json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all trips
const getTrips = async (req, res) => {
  try {
    const trips = await tripModel
      .find()
      .populate("createdBy", "name email")
      .populate("members", "name email");
    res.status(200).json({ trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get trip by ID
const getTripById = async (req, res) => {
  const { id } = req.params;
  try {
    const trip = await tripModel
      .findById(id)
      .populate("createdBy", "name email")
      .populate("members", "name email");
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json({ trip });
  } catch (error) {
    console.error("Error fetching trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update trip details
const updateTrip = async (req, res) => {
  const { id } = req.params;
  const { tripName, members } = req.body;
  try {
    const updatedTrip = await tripModel.findByIdAndUpdate(
      id,
      { tripName, members },
      { new: true }
    );
    if (!updatedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res
      .status(200)
      .json({ message: "Trip updated successfully", trip: updatedTrip });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//delete a trip
const deleteTrip = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTrip = await tripModel.findByIdAndDelete(id);
    if (!deletedTrip) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createTrip, getTrips, getTripById, updateTrip, deleteTrip };
