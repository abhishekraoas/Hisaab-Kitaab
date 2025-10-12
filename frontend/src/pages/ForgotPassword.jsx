import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // <-- React Router hook

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to send reset link
    alert(`Password reset link sent to ${email}`);
    // Redirect to SignIn page
    navigate("/"); // or "/signin" if route is "/signin"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>
        <p className="text-center text-gray-500 mb-6">
          Enter your email to receive a password reset link
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            Send Reset Link
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/users/signin" className="text-blue-500 hover:underline">
            Back to Sign In
          </Link>
          <Link to="/users/signup" className="text-blue-500 hover:underline">
            Create Account
          </Link>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} HisabKitab
        </div>
      </div>
    </div>
  );
}
