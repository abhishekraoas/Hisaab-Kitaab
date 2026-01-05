import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from 'react-hot-toast';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaDownload, FaArrowLeft, FaCalendar } from "react-icons/fa";
import { SkeletonChart, SkeletonStats } from '../components/SkeletonLoader';
import PullToRefresh from '../components/PullToRefresh';

const Reports = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("monthly"); // monthly, yearly
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [yearlySummary, setYearlySummary] = useState(null);

  const COLORS = [
    "#16476A", // Medium Blue
    "#3B9797", // Teal
    "#FDB5CE", // Pink
    "#132440", // Dark Navy
    "#4F46E5", // indigo
    "#7C3AED", // purple
    "#10B981", // green
    "#F59E0B", // amber
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/signin");
      return;
    }
    fetchReports();
  }, [selectedMonth, selectedYear, activeTab]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      if (activeTab === "monthly") {
        const response = await axios.get(
          `http://localhost:5000/api/analytics/monthly-summary?year=${selectedYear}&month=${selectedMonth}`,
          { withCredentials: true }
        );
        setMonthlySummary(response.data);
      } else {
        const response = await axios.get(
          `http://localhost:5000/api/analytics/yearly-summary?year=${selectedYear}`,
          { withCredentials: true }
        );
        setYearlySummary(response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchReports();
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/analytics/export?year=${selectedYear}&month=${selectedMonth}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `expenses_${selectedYear}_${selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV exported successfully!');
    } catch (err) {
      console.error("Error exporting data:", err);
      toast.error('Failed to export data');
    }
  };

  const handleExportPDF = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedMonth) params.append("month", selectedMonth);
      if (selectedYear) params.append("year", selectedYear);

      const response = await axios.get(
        `http://localhost:5000/api/analytics/export-pdf?${params}`,
        {
          withCredentials: true,
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `expense-report-${selectedMonth || selectedYear || "all"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF exported successfully!');
    } catch (err) {
      console.error("Error exporting PDF:", err);
      toast.error('Failed to export PDF');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SkeletonStats />
            <SkeletonStats />
            <SkeletonStats />
            <SkeletonStats />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonChart />
            <SkeletonChart />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 hover:text-gray-900 dark:hover:text-white transition font-semibold"
          >
            <FaArrowLeft /> Back to Home
          </button>

          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
              Reports & Analytics
            </h1>
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 bg-purple-600 dark:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition shadow-lg"
              >
                <FaDownload /> Export PDF
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg"
              >
                <FaDownload /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "monthly"
                ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Monthly Report
          </button>
          <button
            onClick={() => setActiveTab("yearly")}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === "yearly"
                ? "bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            Yearly Report
          </button>
        </div>

        {/* Date Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <FaCalendar className="text-indigo-600 dark:text-indigo-400 text-xl" />
            <div className="flex gap-4">
              {activeTab === "monthly" && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
              )}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              >
                {[2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Monthly Report */}
        {activeTab === "monthly" && monthlySummary && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                  Total Spent
                </h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  ₹{monthlySummary.totalSpent}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {monthlySummary.period.monthName} {monthlySummary.period.year}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                  Total Expenses
                </h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {monthlySummary.expenseCount}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Transactions</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                  Average per Expense
                </h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  ₹
                  {monthlySummary.expenseCount > 0
                    ? (
                        monthlySummary.totalSpent / monthlySummary.expenseCount
                      ).toFixed(2)
                    : 0}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Per transaction</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown Pie Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Spending by Category
                </h3>
                {monthlySummary.categoryBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={monthlySummary.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) =>
                          `${category} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {monthlySummary.categoryBreakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 py-12">
                    No expenses in this period
                  </p>
                )}
              </div>

              {/* Group Breakdown */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Spending by Group
                </h3>
                {monthlySummary.groupBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlySummary.groupBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="group" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Bar dataKey="amount" fill="#4F46E5" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                    No expenses in this period
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Yearly Report */}
        {activeTab === "yearly" && yearlySummary && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                  Total Spent
                </h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  ₹{yearlySummary.totalSpent}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Year {yearlySummary.year}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                  Total Expenses
                </h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  {yearlySummary.expenseCount}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Transactions</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">
                  Monthly Average
                </h3>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">
                  ₹{(yearlySummary.totalSpent / 12).toFixed(2)}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Per month</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6">
              {/* Monthly Trend Bar Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Monthly Spending Trend
                </h3>
                {yearlySummary.monthlyBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={yearlySummary.monthlyBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Legend />
                      <Bar dataKey="amount" fill="#16476A" name="Amount Spent" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                    No expenses in this year
                  </p>
                )}
              </div>

              {/* Category Breakdown Pie Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                  Yearly Category Breakdown
                </h3>
                {yearlySummary.categoryBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={yearlySummary.categoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percent }) =>
                          `${category} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {yearlySummary.categoryBreakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `₹${value}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                    No expenses in this year
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </PullToRefresh>
  );
};

export default Reports;
