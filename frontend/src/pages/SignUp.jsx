import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // ✅ yahan pe direct API instance use kar rahe hain
      const res = await API.post("/users/signup", formData);

      setMessage(res.data.message || "User registered successfully!");
      setTimeout(() => navigate("/users/signin"), 1000);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-20 pb-10">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          🪙 Hisaab-Kitaab Sign Up
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create your free account
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {["name", "email", "mobile", "password"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-1"
              >
                {field === "mobile"
                  ? "Mobile Number"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "email"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-3 text-center text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/users/signin" className="text-blue-500 hover:underline">
            Already have an account? Sign In
          </Link>
          <Link to="/users/forgot-password" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} HisabKitab
        </div>
      </div>
    </div>
  );
}
