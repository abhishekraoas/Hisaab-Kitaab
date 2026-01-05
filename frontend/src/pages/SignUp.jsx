import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../utils/api";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Client-side validation
    if (formData.password.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long",
      });
      setLoading(false);
      return;
    }

    if (formData.mobile.length < 10) {
      setMessage({
        type: "error",
        text: "Please enter a valid mobile number (at least 10 digits)",
      });
      setLoading(false);
      return;
    }

    try {
      console.log("Sending signup request...", formData.email);
      const res = await API.post("/users/signup", formData);
      console.log("Signup successful:", res.data);
      
      setMessage({ type: "success", text: res.data.message });
      // Redirect to OTP verification page
      setTimeout(() => navigate("/verify-otp", { state: { email: formData.email } }), 1500);
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response);
      
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || errorMessage;
        console.log("Server error message:", errorMessage);
      } else if (error.request) {
        // Request made but no response
        errorMessage = "Cannot connect to server. Please check your connection.";
        console.log("No response from server");
      } else {
        // Error in request setup
        errorMessage = error.message || errorMessage;
        console.log("Request setup error:", errorMessage);
      }
      
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 pt-20 pb-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            💰 Hisaab Kitaab
          </h2>
          <p className="text-gray-500 mt-2">Create your free account</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {["name", "email", "mobile", "password"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-2"
              >
                {field === "mobile"
                  ? "Mobile Number"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {field === "password" ? (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id={field}
                    placeholder={`Enter your ${field}`}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
                  </button>
                </div>
              ) : (
                <input
                  type={
                    field === "email"
                      ? "email"
                      : "text"
                  }
                  id={field}
                  placeholder={`Enter your ${
                    field === "mobile" ? "mobile number" : field
                  }`}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-indigo-600 font-semibold hover:text-indigo-700"
            >
              Sign In
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} Hisaab Kitaab. All rights reserved.
        </div>
      </div>
    </div>
  );
}
