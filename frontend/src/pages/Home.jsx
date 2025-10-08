import React from "react";
import mockData from "../assets/mockData.json";

export default function Home() {
  const { user, stats, expenses, incomeEntries, groups } = mockData;

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-20">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl shadow bg-green-500 text-white">
          <h3>Total Income</h3>
          <p className="text-2xl font-bold mt-2">₹{stats.income}</p>
        </div>
        <div className="p-6 rounded-xl shadow bg-red-500 text-white">
          <h3>Total Expenses</h3>
          <p className="text-2xl font-bold mt-2">₹{stats.expenses}</p>
        </div>
        <div className="p-6 rounded-xl shadow bg-blue-500 text-white">
          <h3>Savings</h3>
          <p className="text-2xl font-bold mt-2">₹{stats.savings}</p>
        </div>
      </div>

      {/* Expenses */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Recent Expenses</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="pb-2">Description</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Amount</th>
              <th className="pb-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{e.description}</td>
                <td className="py-2">{e.category}</td>
                <td className="py-2">₹{e.amount}</td>
                <td className="py-2">{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Income */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Income</h3>
        <ul>
          {incomeEntries.map((i) => (
            <li key={i.id} className="mb-2">
              {i.source}: ₹{i.amount} ({i.date})
            </li>
          ))}
        </ul>
      </div>

      {/* Groups */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Groups & Shared Expenses</h3>
        {groups.map((g) => (
          <div key={g.id} className="mb-4 p-4 border rounded-lg">
            <h4 className="font-semibold">{g.name}</h4>
            <p>Members: {g.members.join(", ")}</p>
            <ul className="mt-2">
              {g.expenses.map((ex, idx) => (
                <li key={idx}>
                  {ex.description} - ₹{ex.amount} (Paid by {ex.paidBy})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
