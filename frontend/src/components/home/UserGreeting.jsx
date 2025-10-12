import React from "react";

export default function UserGreeting({ user }) {
  if (!user) return null;

  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold text-gray-800">
        Hello, <span className="text-blue-600">{user.name}</span> 👋
      </h1>
      <p className="text-gray-500 mt-2">
        Welcome back to <span className="font-semibold">Hisaab-Kitaab</span>!
      </p>
    </div>
  );
}
