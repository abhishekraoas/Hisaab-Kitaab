import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
      }
    };
    fetchUser();
  }, []);

  const handleProfileClick = () => navigate("/profile");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/register");
  };

  return (
    <header className="bg-blue-500 text-white p-4 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/" className="hover:underline">
          <h1 className="font-bold text-xl">Hisaab-Kitaab</h1>
        </Link>
        <nav className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/signin" className="hover:underline">Sign In</Link>
              <Link to="/signup" className="hover:underline">Sign Up</Link>
            </>
          ) : (
            <div className="relative flex items-center space-x-2">
              <button
                onClick={handleProfileClick}
                className="bg-white text-blue-500 px-3 py-1 rounded-full font-semibold"
              >
                {user.name.split(" ")[0]}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
