import tripModel from "../models/trip.model.js";
import userModel from "../models/user.model.js";

// Create a new trip/group
const createTrip = async (req, res) => {
  const { tripName, description, category, members } = req.body;
  const createdBy = req.session.userId;

  if (!tripName) {
    return res.status(400).json({ message: "Group name is required." });
  }

  try {
    // Add creator to members if not already included
    const memberIds = members || [];
    if (!memberIds.includes(createdBy)) {
      memberIds.push(createdBy);
    }

    const newTrip = new tripModel({
      tripName,
      description,
      category: category || "Other",
      createdBy,
      members: memberIds,
    });

    await newTrip.save();
    
    const populatedTrip = await tripModel
      .findById(newTrip._id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(201).json({
      message: "Group created successfully",
      trip: populatedTrip,
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all trips for logged-in user
const getTrips = async (req, res) => {
  const userId = req.session.userId;

  try {
    const trips = await tripModel
      .find({
        $or: [{ createdBy: userId }, { members: userId }],
        isActive: true,
      })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ trips });
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get trip by ID with member details
const getTripById = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const trip = await tripModel
      .findById(id)
      .populate("createdBy", "name email mobile")
      .populate("members", "name email mobile");

    if (!trip) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is member
    const isMember = trip.members.some(
      (member) => member._id.toString() === userId
    );
    if (!isMember && trip.createdBy._id.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
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
  const { tripName, description, category } = req.body;
  const userId = req.session.userId;

  try {
    const trip = await tripModel.findById(id);
    if (!trip) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can update
    if (trip.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only creator can update group" });
    }

    trip.tripName = tripName || trip.tripName;
    trip.description = description !== undefined ? description : trip.description;
    trip.category = category || trip.category;

    await trip.save();

    const updatedTrip = await tripModel
      .findById(id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Group updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.error("Error updating trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add member to trip
const addMember = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;
  const userId = req.session.userId;

  try {
    const trip = await tripModel.findById(id);
    if (!trip) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can add members
    if (trip.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only creator can add members" });
    }

    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Check if already member
    if (trip.members.includes(user._id)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    trip.members.push(user._id);
    await trip.save();

    const updatedTrip = await tripModel
      .findById(id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Member added successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.error("Error adding member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove member from trip
const removeMember = async (req, res) => {
  const { id, memberId } = req.params;
  const userId = req.session.userId;

  try {
    const trip = await tripModel.findById(id);
    if (!trip) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can remove members
    if (trip.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only creator can remove members" });
    }

    // Can't remove creator
    if (memberId === trip.createdBy.toString()) {
      return res.status(400).json({ message: "Cannot remove group creator" });
    }

    trip.members = trip.members.filter((m) => m.toString() !== memberId);
    await trip.save();

    const updatedTrip = await tripModel
      .findById(id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Member removed successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const trip = await tripModel.findById(id);
    if (!trip) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can delete
    if (trip.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only creator can delete group" });
    }

    await tripModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Generate invite link
const generateInviteLink = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const trip = await tripModel.findById(id);
    if (!trip) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Only creator can generate invite link
    if (trip.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Only creator can generate invite link" });
    }

    // Generate or refresh token
    const token = trip.generateInviteToken();
    await trip.save();

    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/invite/${token}`;

    res.status(200).json({
      message: "Invite link generated successfully",
      inviteLink,
      expiresAt: trip.inviteTokenExpiry,
    });
  } catch (error) {
    console.error("Error generating invite link:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept invite and join group
const acceptInvite = async (req, res) => {
  const { token } = req.params;
  const userId = req.session.userId;

  try {
    const trip = await tripModel
      .findOne({ inviteToken: token })
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!trip) {
      return res.status(404).json({ message: "Invalid invite link" });
    }

    if (!trip.isInviteTokenValid()) {
      return res.status(400).json({ message: "Invite link has expired" });
    }

    // Check if user is already a member
    if (trip.members.some((m) => m._id.toString() === userId)) {
      return res.status(200).json({
        message: "You are already a member of this group",
        trip,
        alreadyMember: true,
      });
    }

    // Add user to members
    trip.members.push(userId);
    await trip.save();

    const updatedTrip = await tripModel
      .findById(trip._id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.status(200).json({
      message: "Successfully joined the group",
      trip: updatedTrip,
      alreadyMember: false,
    });
  } catch (error) {
    console.error("Error accepting invite:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  addMember,
  removeMember,
  deleteTrip,
  generateInviteLink,
  acceptInvite,
};
