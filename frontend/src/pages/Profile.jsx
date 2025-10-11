import React, { useEffect, useState } from "react";
import API from "../utils/api";

export default function Profile() {
  const [user, setUser] = useState(null);

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
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-8 mt-16 max-w-xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.mobile}</p>
    </div>
  );
}
