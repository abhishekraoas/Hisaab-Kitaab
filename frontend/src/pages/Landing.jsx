import React from "react";
import { Link } from "react-router-dom";
import { GiMoneyStack, GiPiggyBank, GiTeamIdea } from "react-icons/gi";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 p-6">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-12">
        <img
          src="assets/EXPENCE-TRACKER-LOGO.png"
          alt="Hisaab-Kitaab Logo"
          className="w-28 h-28 mb-4 animate-bounce"
        />
        <h1 className="text-5xl font-extrabold text-blue-600 mb-2 drop-shadow-lg">
          Hisaab-Kitaab
        </h1>
        <p className="text-center max-w-md text-gray-700 text-lg">
          Track your income, expenses, and shared group expenses easily. Manage your trips and finances efficiently with Hisaab-Kitaab.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full max-w-5xl">
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
          <GiMoneyStack size={60} className="text-green-500 mb-3" />
          <h3 className="font-bold text-xl mb-1">Track Income</h3>
          <p className="text-center text-gray-600">
            Add and monitor all your sources of income.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
          <GiPiggyBank size={60} className="text-red-500 mb-3" />
          <h3 className="font-bold text-xl mb-1">Manage Expenses</h3>
          <p className="text-center text-gray-600">
            Keep record of all your expenses and savings.
          </p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
          <GiTeamIdea size={60} className="text-blue-500 mb-3" />
          <h3 className="font-bold text-xl mb-1">Shared Groups</h3>
          <p className="text-center text-gray-600">
            Create groups and split expenses fairly.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-6 mb-12">
        <Link
          to="/users/signin"
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition transform hover:scale-105"
        >
          Sign In
        </Link>
        <Link
          to="/users/signup"
          className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition transform hover:scale-105"
        >
          Sign Up
        </Link>
      </div>

      {/* Footer */}
      <p className="text-gray-500 text-sm mt-4">
        © 2025 Hisaab-Kitaab. All rights reserved.
      </p>
    </div>
  );
}
