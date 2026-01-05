import expenseModel from "../models/expense.model.js";
import tripModel from "../models/trip.model.js";
import userModel from "../models/user.model.js";
import PDFDocument from "pdfkit";

// Get budget status and alerts
export const getBudgetStatus = async (req, res) => {
  const userId = req.session.userId;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const monthlyBudget = user.monthlyBudget || 0;

    if (monthlyBudget === 0) {
      return res.status(200).json({
        hasBudget: false,
        message: "No budget set",
      });
    }

    // Get current month's expenses
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Get all user's groups
    const userTrips = await tripModel.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });

    const tripIds = userTrips.map((trip) => trip._id);

    // Get all expenses from user's groups in current month
    const expenses = await expenseModel.find({
      tripId: { $in: tripIds },
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // Calculate user's share of expenses
    let totalSpent = 0;
    expenses.forEach((expense) => {
      const userSplit = expense.splitDetails.find(
        (split) => split.userId.toString() === userId
      );
      if (userSplit) {
        totalSpent += userSplit.amount;
      }
    });

    const percentageUsed = (totalSpent / monthlyBudget) * 100;
    const remaining = monthlyBudget - totalSpent;

    let alertLevel = "safe"; // safe, warning, danger
    let alertMessage = "";

    if (percentageUsed >= 100) {
      alertLevel = "danger";
      alertMessage = `Budget exceeded! You've spent ₹${totalSpent.toFixed(
        2
      )} out of ₹${monthlyBudget}`;
    } else if (percentageUsed >= 80) {
      alertLevel = "warning";
      alertMessage = `Budget warning! You've used ${percentageUsed.toFixed(
        1
      )}% of your monthly budget`;
    } else {
      alertLevel = "safe";
      alertMessage = `You're on track! ${percentageUsed.toFixed(
        1
      )}% of budget used`;
    }

    res.status(200).json({
      hasBudget: true,
      monthlyBudget,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      remaining: parseFloat(remaining.toFixed(2)),
      percentageUsed: parseFloat(percentageUsed.toFixed(2)),
      alertLevel,
      alertMessage,
    });
  } catch (error) {
    console.error("❌ Error getting budget status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get monthly expense summary
export const getMonthlySummary = async (req, res) => {
  const userId = req.session.userId;
  const { year, month } = req.query;

  try {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    // Get user's groups
    const userTrips = await tripModel.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });
    const tripIds = userTrips.map((trip) => trip._id);

    // Get expenses in date range
    const expenses = await expenseModel
      .find({
        tripId: { $in: tripIds },
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .populate("tripId", "tripName")
      .populate("paidBy", "name");

    // Calculate user's share
    let totalSpent = 0;
    let categoryBreakdown = {};
    let groupBreakdown = {};

    expenses.forEach((expense) => {
      const userSplit = expense.splitDetails.find(
        (split) => split.userId.toString() === userId
      );

      if (userSplit) {
        const amount = userSplit.amount;
        totalSpent += amount;

        // Category breakdown
        if (!categoryBreakdown[expense.category]) {
          categoryBreakdown[expense.category] = 0;
        }
        categoryBreakdown[expense.category] += amount;

        // Group breakdown
        const groupName = expense.tripId?.tripName || "Unknown";
        if (!groupBreakdown[groupName]) {
          groupBreakdown[groupName] = 0;
        }
        groupBreakdown[groupName] += amount;
      }
    });

    // Format for charts
    const categoryData = Object.keys(categoryBreakdown).map((category) => ({
      category,
      amount: parseFloat(categoryBreakdown[category].toFixed(2)),
    }));

    const groupData = Object.keys(groupBreakdown).map((group) => ({
      group,
      amount: parseFloat(groupBreakdown[group].toFixed(2)),
    }));

    res.status(200).json({
      period: {
        month: targetMonth + 1,
        year: targetYear,
        monthName: new Date(targetYear, targetMonth).toLocaleString("default", {
          month: "long",
        }),
      },
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      expenseCount: expenses.length,
      categoryBreakdown: categoryData,
      groupBreakdown: groupData,
    });
  } catch (error) {
    console.error("❌ Error getting monthly summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get yearly summary
export const getYearlySummary = async (req, res) => {
  const userId = req.session.userId;
  const { year } = req.query;

  try {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const startDate = new Date(targetYear, 0, 1);
    const endDate = new Date(targetYear, 11, 31, 23, 59, 59);

    // Get user's groups
    const userTrips = await tripModel.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });
    const tripIds = userTrips.map((trip) => trip._id);

    // Get expenses in year
    const expenses = await expenseModel.find({
      tripId: { $in: tripIds },
      createdAt: { $gte: startDate, $lte: endDate },
    });

    // Calculate monthly breakdown
    let monthlyData = Array(12).fill(0);
    let totalSpent = 0;
    let categoryBreakdown = {};

    expenses.forEach((expense) => {
      const userSplit = expense.splitDetails.find(
        (split) => split.userId.toString() === userId
      );

      if (userSplit) {
        const amount = userSplit.amount;
        totalSpent += amount;

        // Month breakdown
        const month = new Date(expense.createdAt).getMonth();
        monthlyData[month] += amount;

        // Category breakdown
        if (!categoryBreakdown[expense.category]) {
          categoryBreakdown[expense.category] = 0;
        }
        categoryBreakdown[expense.category] += amount;
      }
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyChartData = monthlyData.map((amount, index) => ({
      month: monthNames[index],
      amount: parseFloat(amount.toFixed(2)),
    }));

    const categoryData = Object.keys(categoryBreakdown).map((category) => ({
      category,
      amount: parseFloat(categoryBreakdown[category].toFixed(2)),
    }));

    res.status(200).json({
      year: targetYear,
      totalSpent: parseFloat(totalSpent.toFixed(2)),
      expenseCount: expenses.length,
      monthlyBreakdown: monthlyChartData,
      categoryBreakdown: categoryData,
    });
  } catch (error) {
    console.error("❌ Error getting yearly summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export data as CSV
export const exportData = async (req, res) => {
  const userId = req.session.userId;
  const { year, month } = req.query;

  try {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    // Get user's groups
    const userTrips = await tripModel.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });
    const tripIds = userTrips.map((trip) => trip._id);

    // Get expenses
    const expenses = await expenseModel
      .find({
        tripId: { $in: tripIds },
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .populate("tripId", "tripName")
      .populate("paidBy", "name");

    // Generate CSV
    let csv = "Date,Group,Description,Category,Total Amount,Your Share,Paid By\n";

    expenses.forEach((expense) => {
      const userSplit = expense.splitDetails.find(
        (split) => split.userId.toString() === userId
      );

      if (userSplit) {
        const date = new Date(expense.createdAt).toLocaleDateString();
        const group = expense.tripId?.tripName || "Unknown";
        const description = expense.description.replace(/,/g, " ");
        const category = expense.category;
        const totalAmount = expense.amount;
        const yourShare = userSplit.amount.toFixed(2);
        const paidBy = expense.paidBy?.name || "Unknown";

        csv += `${date},"${group}","${description}",${category},${totalAmount},${yourShare},${paidBy}\n`;
      }
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=expenses_${targetYear}_${targetMonth + 1}.csv`
    );
    res.status(200).send(csv);
  } catch (error) {
    console.error("❌ Error exporting data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export data as PDF
export const exportPDF = async (req, res) => {
  const userId = req.session.userId;
  const { year, month } = req.query;

  try {
    const targetYear = year ? parseInt(year) : new Date().getFullYear();
    const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();

    const startDate = new Date(targetYear, targetMonth, 1);
    const endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);

    // Get user info
    const user = await userModel.findById(userId);
    
    // Get user's groups
    const userTrips = await tripModel.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });
    const tripIds = userTrips.map((trip) => trip._id);

    // Get expenses
    const expenses = await expenseModel
      .find({
        tripId: { $in: tripIds },
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .populate("tripId", "tripName")
      .populate("paidBy", "name");

    // Calculate totals
    let totalSpent = 0;
    const categoryTotals = {};

    expenses.forEach((expense) => {
      const userSplit = expense.splitDetails.find(
        (split) => split.userId.toString() === userId
      );

      if (userSplit) {
        totalSpent += userSplit.amount;
        if (!categoryTotals[expense.category]) {
          categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += userSplit.amount;
      }
    });

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=expenses_${targetYear}_${targetMonth + 1}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text("Hisaab-Kitaab", { align: "center" });
    doc.fontSize(16).text("Expense Report", { align: "center" });
    doc.moveDown(0.5);
    
    // Period and user info
    const monthName = new Date(targetYear, targetMonth).toLocaleString("default", { month: "long" });
    doc.fontSize(12).font('Helvetica').text(`Period: ${monthName} ${targetYear}`, { align: "center" });
    doc.text(`Generated for: ${user.name} (${user.email})`, { align: "center" });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });
    doc.moveDown(1);

    // Summary section
    doc.fontSize(14).font('Helvetica-Bold').text("Summary");
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Expenses: ${expenses.length}`);
    doc.text(`Total Amount Spent: ₹${totalSpent.toFixed(2)}`);
    doc.text(`Average per Expense: ₹${expenses.length > 0 ? (totalSpent / expenses.length).toFixed(2) : "0.00"}`);
    doc.moveDown(1);

    // Category breakdown
    doc.fontSize(14).font('Helvetica-Bold').text("Category Breakdown");
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    
    Object.keys(categoryTotals).forEach((category) => {
      const percentage = ((categoryTotals[category] / totalSpent) * 100).toFixed(1);
      doc.text(`${category}: ₹${categoryTotals[category].toFixed(2)} (${percentage}%)`);
    });
    doc.moveDown(1);

    // Expense details
    doc.fontSize(14).font('Helvetica-Bold').text("Expense Details");
    doc.moveDown(0.5);

    if (expenses.length === 0) {
      doc.fontSize(11).font('Helvetica').text("No expenses found for this period.");
    } else {
      doc.fontSize(9).font('Helvetica');
      
      // Table header
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 110;
      const col3 = 210;
      const col4 = 290;
      const col5 = 360;
      const col6 = 430;
      const col7 = 500;

      doc.font('Helvetica-Bold');
      doc.text("Date", col1, tableTop);
      doc.text("Group", col2, tableTop);
      doc.text("Description", col3, tableTop);
      doc.text("Category", col4, tableTop);
      doc.text("Total", col5, tableTop);
      doc.text("Share", col6, tableTop);
      doc.text("Paid By", col7, tableTop);

      doc.moveTo(col1, tableTop + 15).lineTo(570, tableTop + 15).stroke();
      doc.moveDown(0.3);

      // Table rows
      doc.font('Helvetica');
      let currentY = tableTop + 20;

      expenses.forEach((expense) => {
        const userSplit = expense.splitDetails.find(
          (split) => split.userId.toString() === userId
        );

        if (userSplit) {
          // Check if we need a new page
          if (currentY > 720) {
            doc.addPage();
            currentY = 50;
          }

          const date = new Date(expense.createdAt).toLocaleDateString();
          const group = (expense.tripId?.tripName || "Unknown").substring(0, 15);
          const description = expense.description.substring(0, 12);
          const category = expense.category.substring(0, 10);
          const totalAmount = `₹${expense.amount}`;
          const yourShare = `₹${userSplit.amount.toFixed(2)}`;
          const paidBy = (expense.paidBy?.name || "Unknown").substring(0, 10);

          doc.text(date, col1, currentY, { width: 50, ellipsis: true });
          doc.text(group, col2, currentY, { width: 90, ellipsis: true });
          doc.text(description, col3, currentY, { width: 70, ellipsis: true });
          doc.text(category, col4, currentY, { width: 60, ellipsis: true });
          doc.text(totalAmount, col5, currentY, { width: 60, ellipsis: true });
          doc.text(yourShare, col6, currentY, { width: 60, ellipsis: true });
          doc.text(paidBy, col7, currentY, { width: 60, ellipsis: true });

          currentY += 20;
        }
      });
    }

    // Footer
    const bottomY = 750;
    doc.fontSize(8).font('Helvetica').text(
      "Generated by Hisaab-Kitaab Expense Management System",
      50,
      bottomY,
      { align: "center" }
    );

    doc.end();
  } catch (error) {
    console.error("❌ Error exporting PDF:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
