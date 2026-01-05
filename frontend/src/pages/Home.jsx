import React, { useEffect, useState } from "react";
import UserGreeting from "../components/home/UserGreeting";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
      fetchBudgetStatus();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <UserGreeting user={user} />
      
      {/* Budget Alert Banner */}
      {budgetStatus && budgetStatus.hasBudget && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {budgetStatus.alertLevel === "danger" && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-red-800">{budgetStatus.alertMessage}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Monthly Budget: ₹{budgetStatus.monthlyBudget} | Spent: ₹{budgetStatus.totalSpent}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {budgetStatus.alertLevel === "warning" && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-yellow-800">{budgetStatus.alertMessage}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Remaining: ₹{budgetStatus.remaining} | Budget: ₹{budgetStatus.monthlyBudget}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {budgetStatus.alertLevel === "safe" && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-green-800">{budgetStatus.alertMessage}</p>
                  <p className="text-xs text-green-600 mt-1">
                    Spent: ₹{budgetStatus.totalSpent} | Remaining: ₹{budgetStatus.remaining}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Create Group Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Create Group</h3>
              <p className="text-gray-600 text-sm mb-4">Start a new trip or group expense</p>
              <button 
                onClick={() => navigate('/groups')}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
              >
                Create New Group
              </button>
            </div>
          </div>

          {/* My Groups Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">My Groups</h3>
              <p className="text-gray-600 text-sm mb-4">View all your expense groups</p>
              <button 
                onClick={() => navigate('/groups')}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg"
              >
                View Groups
              </button>
            </div>
          </div>

          {/* Settlements Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reports</h3>
              <p className="text-gray-600 text-sm mb-4">View analytics and export data</p>
              <button 
                onClick={() => navigate('/reports')}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg"
              >
                View Reports
              </button>
            </div>
          </div>

        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No recent activity yet</p>
            <p className="text-sm text-gray-400 mt-2">Create a group to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
}