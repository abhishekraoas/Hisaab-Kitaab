import React, { useEffect, useState } from "react";
import UserGreeting from "../components/home/UserGreeting";
import PersonalExpenseManager from "../components/home/PersonalExpenseManager";

import { useNavigate } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData)); // user login hai → data set karo
    } else {
      navigate("/users/signin"); // login nahi hai → redirect karo
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <UserGreeting user={user} />
      {user ? (
        <PersonalExpenseManager user={user} />
      ) : (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
          <p className="text-gray-600">Loading your expenses...</p>
        </div>
      )}

    </div>
  );
}
