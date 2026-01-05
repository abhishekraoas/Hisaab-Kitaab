import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import QuickSearch from "./QuickSearch";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await API.post("/users/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("user");
    setUser(null);
    navigate("/signin");
  };

  const handleDeleteAccount = async () => {
    try {
      await API.delete("/users/profile");
      localStorage.removeItem("user");
      setUser(null);
      navigate("/signin");
    } catch (error) {
      console.error("Delete account error:", error);
      alert("Failed to delete account. Please try again.");
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomGradient = (name) => {
    const gradients = [
      "from-purple-400 to-pink-600",
      "from-blue-400 to-indigo-600",
      "from-green-400 to-teal-600",
      "from-yellow-400 to-orange-600",
      "from-red-400 to-pink-600",
      "from-indigo-400 to-purple-600",
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 text-white shadow-lg sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/home"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <span className="text-2xl">💰</span>
              <h1 className="font-bold text-xl sm:text-2xl">Hisaab-Kitaab</h1>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  {/* Theme Toggle */}
                  <ThemeToggle />
                  
                  {/* Quick Search */}
                  <QuickSearch />
                  
                  <div className="relative" ref={dropdownRef}>
                  {/* Profile Button */}
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-2 sm:space-x-3 sm:bg-white/10 hover:bg-white/20 backdrop-blur-sm sm:px-4 sm:py-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/30"
                  >
                    <span className="hidden sm:block text-sm font-semibold text-white">
                      {user.name.split(" ")[0]}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${getRandomGradient(
                        user.name
                      )} flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/50`}
                    >
                      {getInitials(user.name)}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-slideDown">
                      {/* Profile Header */}
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-20 h-20 rounded-full bg-gradient-to-br ${getRandomGradient(
                              user.name
                            )} flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-white dark:ring-gray-600 mb-3`}
                          >
                            {getInitials(user.name)}
                          </div>
                          <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>

                      {/* User Details */}
                      <div className="p-4 bg-white dark:bg-gray-800">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                />
                              </svg>
                              Mobile
                            </span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {user.mobile}
                            </span>
                          </div>

                          {user.income > 0 && (
                            <div className="flex items-center justify-between py-2 px-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                              <span className="text-sm text-green-700 dark:text-green-400 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                Income
                              </span>
                              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                ₹{user.income?.toLocaleString()}
                              </span>
                            </div>
                          )}

                          {user.monthlyBudget > 0 && (
                            <div className="flex items-center justify-between py-2 px-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                              <span className="text-sm text-blue-700 dark:text-blue-400 flex items-center">
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                  />
                                </svg>
                                Budget
                              </span>
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                                ₹{user.monthlyBudget?.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-900 space-y-2">
                        <button
                          onClick={() => {
                            navigate("/profile");
                            setShowDropdown(false);
                          }}
                          className="w-full flex items-center justify-center space-x-2 bg-indigo-600 dark:bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span>View Profile</span>
                        </button>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center justify-center space-x-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span>Logout</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            setShowDeleteModal(true);
                          }}
                          className="w-full flex items-center justify-center space-x-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-3 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          <span>Delete Account</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="hidden sm:block text-white hover:text-gray-200 font-semibold transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <svg
                  className="w-12 h-12 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Delete Account
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete your account? This action cannot
                be undone. All your data will be permanently deleted.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
