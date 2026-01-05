import expenseModel from "../models/expense.model.js";
import tripModel from "../models/trip.model.js";
import userModel from "../models/user.model.js";

// Create a new expense with split calculation
const createExpense = async (req, res) => {
  const { tripId, amount, description, category, splitType, splitDetails } = req.body;
  const paidBy = req.session.userId;

  if (!tripId || !amount || !description) {
    return res.status(400).json({ message: "Trip, amount, and description are required" });
  }

  try {
    // Verify trip exists and user is member
    const trip = await tripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = trip.members.some(m => m.toString() === paidBy) || 
                     trip.createdBy.toString() === paidBy;
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Calculate split based on type
    let calculatedSplitDetails = [];
    const memberCount = trip.members.length;

    if (splitType === 'equal') {
      const shareAmount = amount / memberCount;
      calculatedSplitDetails = trip.members.map(memberId => ({
        userId: memberId,
        amount: parseFloat(shareAmount.toFixed(2))
      }));
    } else if (splitType === 'custom' && splitDetails) {
      // Validate custom amounts sum to total
      const totalCustom = splitDetails.reduce((sum, s) => sum + s.amount, 0);
      if (Math.abs(totalCustom - amount) > 0.01) {
        return res.status(400).json({ message: "Custom amounts must equal total expense" });
      }
      calculatedSplitDetails = splitDetails;
    } else if (splitType === 'percentage' && splitDetails) {
      // Validate percentages sum to 100
      const totalPercentage = splitDetails.reduce((sum, s) => sum + s.percentage, 0);
      if (Math.abs(totalPercentage - 100) > 0.01) {
        return res.status(400).json({ message: "Percentages must sum to 100" });
      }
      calculatedSplitDetails = splitDetails.map(s => ({
        userId: s.userId,
        amount: parseFloat(((amount * s.percentage) / 100).toFixed(2))
      }));
    } else {
      return res.status(400).json({ message: "Invalid split type or missing split details" });
    }

    const newExpense = new expenseModel({
      tripId,
      paidBy,
      amount,
      description,
      category: category || "Other",
      splitType: splitType || "equal",
      splitDetails: calculatedSplitDetails,
    });

    await newExpense.save();

    const populatedExpense = await expenseModel
      .findById(newExpense._id)
      .populate("tripId", "tripName")
      .populate("paidBy", "name email")
      .populate("splitDetails.userId", "name email");

    res.status(201).json({
      message: "Expense added successfully",
      expense: populatedExpense,
    });
  } catch (error) {
    console.error("❌ Error creating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const expense = await expenseModel
      .findById(id)
      .populate("tripId", "tripName members")
      .populate("paidBy", "name email")
      .populate("splitDetails.userId", "name email");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Verify user is member of trip
    const trip = await tripModel.findById(expense.tripId._id);
    const isMember = trip.members.some(m => m.toString() === userId) || 
                     trip.createdBy.toString() === userId;
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ expense });
  } catch (error) {
    console.error("❌ Error fetching expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all expenses for a trip
const getAllExpenseByTripId = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.session.userId;

  try {
    const trip = await tripModel.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Verify user is member
    const isMember = trip.members.some(m => m.toString() === userId) || 
                     trip.createdBy.toString() === userId;
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const expenses = await expenseModel
      .find({ tripId })
      .populate("paidBy", "name email")
      .populate("splitDetails.userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ expenses });
  } catch (error) {
    console.error("❌ Error fetching expenses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an expense
const updateExpense = async (req, res) => {
  const { id } = req.params;
  const { amount, description, category, splitType, splitDetails } = req.body;
  const userId = req.session.userId;

  try {
    const expense = await expenseModel.findById(id).populate("tripId");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Only payer can update
    if (expense.paidBy.toString() !== userId) {
      return res.status(403).json({ message: "Only the payer can update this expense" });
    }

    expense.amount = amount || expense.amount;
    expense.description = description || expense.description;
    expense.category = category || expense.category;
    
    if (splitType) {
      expense.splitType = splitType;
      
      // Recalculate splits
      const trip = await tripModel.findById(expense.tripId._id);
      const memberCount = trip.members.length;
      
      if (splitType === 'equal') {
        const shareAmount = expense.amount / memberCount;
        expense.splitDetails = trip.members.map(memberId => ({
          userId: memberId,
          amount: parseFloat(shareAmount.toFixed(2))
        }));
      } else if (splitDetails) {
        expense.splitDetails = splitDetails;
      }
    }

    await expense.save();

    const updatedExpense = await expenseModel
      .findById(id)
      .populate("tripId", "tripName")
      .populate("paidBy", "name email")
      .populate("splitDetails.userId", "name email");

    res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("❌ Error updating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete an expense
const deleteExpense = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.userId;

  try {
    const expense = await expenseModel.findById(id).populate("tripId");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Only payer or trip creator can delete
    const trip = await tripModel.findById(expense.tripId._id);
    if (expense.paidBy.toString() !== userId && trip.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await expenseModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Calculate settlements for a trip (who owes whom)
const calculateSettlements = async (req, res) => {
  const { tripId } = req.params;
  const userId = req.session.userId;

  try {
    const trip = await tripModel.findById(tripId).populate("members", "name email");
    if (!trip) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Verify user is member
    const isMember = trip.members.some(m => m._id.toString() === userId) || 
                     trip.createdBy.toString() === userId;
    if (!isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    const expenses = await expenseModel.find({ tripId });

    if (!expenses.length) {
      return res.status(200).json({
        message: "No expenses found",
        settlements: [],
        summary: {},
      });
    }

    // Calculate balances: positive = gets money back, negative = owes money
    const balances = {};
    trip.members.forEach(member => {
      balances[member._id.toString()] = {
        userId: member._id,
        name: member.name,
        email: member.email,
        paid: 0,
        owes: 0,
        balance: 0,
      };
    });

    // Calculate what each person paid and owes
    expenses.forEach(expense => {
      const payerId = expense.paidBy.toString();
      
      // Add to what they paid
      if (balances[payerId]) {
        balances[payerId].paid += expense.amount;
      }

      // Add to what each person owes based on split
      expense.splitDetails.forEach(split => {
        const splitUserId = split.userId.toString();
        if (balances[splitUserId]) {
          balances[splitUserId].owes += split.amount;
        }
      });
    });

    // Calculate net balance
    Object.keys(balances).forEach(userId => {
      balances[userId].balance = parseFloat(
        (balances[userId].paid - balances[userId].owes).toFixed(2)
      );
    });

    // Simplified settlement algorithm
    const settlements = [];
    const creditors = Object.values(balances).filter(b => b.balance > 0.01).sort((a, b) => b.balance - a.balance);
    const debtors = Object.values(balances).filter(b => b.balance < -0.01).sort((a, b) => a.balance - b.balance);

    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const creditor = creditors[i];
      const debtor = debtors[j];
      
      const settleAmount = Math.min(creditor.balance, Math.abs(debtor.balance));
      
      settlements.push({
        from: {
          userId: debtor.userId,
          name: debtor.name,
          email: debtor.email,
        },
        to: {
          userId: creditor.userId,
          name: creditor.name,
          email: creditor.email,
        },
        amount: parseFloat(settleAmount.toFixed(2)),
      });

      creditor.balance -= settleAmount;
      debtor.balance += settleAmount;

      if (creditor.balance < 0.01) i++;
      if (debtor.balance > -0.01) j++;
    }

    const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.status(200).json({
      message: "Settlements calculated successfully",
      tripName: trip.tripName,
      totalExpense: parseFloat(totalExpense.toFixed(2)),
      settlements,
      summary: balances,
    });
  } catch (error) {
    console.error("❌ Error calculating settlements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { 
  createExpense, 
  getExpenseById, 
  getAllExpenseByTripId, 
  updateExpense, 
  deleteExpense, 
  calculateSettlements 
};