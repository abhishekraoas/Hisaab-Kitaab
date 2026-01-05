import React, { useEffect, useState } from "react";
import UserGreeting from "../components/home/UserGreeting";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PullToRefresh from "../components/PullToRefresh";
import { FaWallet, FaCalendarAlt, FaChartLine, FaReceipt } from "react-icons/fa";
import EmptyState from "../components/EmptyState";

export default function Home() {
  const [user, setUser] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const [quickStats, setQuickStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchBudgetStatus();
      fetchQuickStats();
    } else {
      navigate("/signin");
    }
  }, [navigate]);

  const fetchBudgetStatus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/analytics/budget-status",
        { withCredentials: true }
      );
      setBudgetStatus(response.data);
    } catch (err) {
      console.error("Error fetching budget status:", err);
    }
  };

  const fetchQuickStats = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      
      const response = await axios.get(
        `http://localhost:5000/api/analytics/monthly-summary?year=${year}&month=${month}`,
        { withCredentials: true }
      );
      setQuickStats(response.data);
    } catch (err) {
      console.error("Error fetching quick stats:", err);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchBudgetStatus(), fetchQuickStats()]);
  };

  const getTodaySpending = () => {
    if (!quickStats || !quickStats.dailyExpenses) return 0;
    const today = new Date().getDate();
    const todayData = quickStats.dailyExpenses.find(d => d.day === today);
    return todayData ? todayData.amount : 0;
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="transition-colors duration-200">
        <UserGreeting user={user} />
      
      {/* Budget Alert Banner */}
      {budgetStatus && budgetStatus.hasBudget && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {budgetStatus.alertLevel === "danger" && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">{budgetStatus.alertMessage}</p>
                  <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                    Monthly Budget: ₹{budgetStatus.monthlyBudget} | Spent: ₹{budgetStatus.totalSpent}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {budgetStatus.alertLevel === "warning" && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-500 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">{budgetStatus.alertMessage}</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
                    Remaining: ₹{budgetStatus.remaining} | Budget: ₹{budgetStatus.monthlyBudget}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {budgetStatus.alertLevel === "safe" && (
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">{budgetStatus.alertMessage}</p>
                  <p className="text-xs text-green-600 dark:text-green-300 mt-1">
                    Spent: ₹{budgetStatus.totalSpent} | Remaining: ₹{budgetStatus.remaining}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Stats Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quick Stats</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Spending */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <FaWallet className="text-2xl" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium opacity-80">Today</p>
                <p className="text-2xl font-bold">₹{getTodaySpending()}</p>
              </div>
            </div>
            <div className="border-t border-white/20 pt-3">
              <p className="text-sm opacity-90">Today's Spending</p>
            </div>
          </div>

          {/* This Month Total */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <FaCalendarAlt className="text-2xl" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium opacity-80">This Month</p>
                <p className="text-2xl font-bold">₹{quickStats?.totalExpense || 0}</p>
              </div>
            </div>
            <div className="border-t border-white/20 pt-3">
              <p className="text-sm opacity-90">Monthly Total</p>
            </div>
          </div>

          {/* Budget Progress */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <FaChartLine className="text-2xl" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium opacity-80">Budget Used</p>
                <p className="text-2xl font-bold">
                  {budgetStatus?.hasBudget 
                    ? `${Math.round((budgetStatus.totalSpent / budgetStatus.monthlyBudget) * 100)}%`
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
            <div className="border-t border-white/20 pt-3">
              <p className="text-sm opacity-90">Budget Progress</p>
            </div>
          </div>

          {/* Total Transactions */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                <FaReceipt className="text-2xl" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium opacity-80">Transactions</p>
                <p className="text-2xl font-bold">{quickStats?.expenseCount || 0}</p>
              </div>
            </div>
            <div className="border-t border-white/20 pt-3">
              <p className="text-sm opacity-90">This Month</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        {quickStats && quickStats.categoryBreakdown && quickStats.categoryBreakdown.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top Spending Categories</h3>
            <div className="space-y-3">
              {quickStats.categoryBreakdown.slice(0, 5).map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category._id}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(category.total / quickStats.totalExpense) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">₹{category.total}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round((category.total / quickStats.totalExpense) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Create Group Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="inline-block p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Create Group</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Start a new trip or group expense</p>
              <button 
                onClick={() => navigate('/groups')}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg"
              >
                Create New Group
              </button>
            </div>
          </div>

          {/* My Groups Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="inline-block p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">My Groups</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">View all your expense groups</p>
              <button 
                onClick={() => navigate('/groups')}
                className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition shadow-lg"
              >
                View Groups
              </button>
            </div>
          </div>

          {/* Settlements Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Reports</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">View analytics and export data</p>
              <button 
                onClick={() => navigate('/reports')}
                className="w-full bg-green-600 dark:bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-700 dark:hover:bg-green-600 transition shadow-lg"
              >
                View Reports
              </button>
            </div>
          </div>

        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
          <EmptyState
            illustration="activity"
            title="No Activity Yet"
            message="Your recent transactions and group activities will appear here once you start using the app."
            actionLabel="Create a Group"
            onAction={() => navigate('/groups')}
          />
        </div>
      </div>
      </div>
    </PullToRefresh>
  );
}