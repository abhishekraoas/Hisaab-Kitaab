import React, { useEffect, useState } from "react";
import API from "../../utils/api";

export default function PersonalExpenseManager({ user }) {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch personal expenses
  const fetchExpenses = async () => {
    try {
      const res = await API.get(`/expenses/user/${user._id}`);
      setExpenses(res.data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    if (user?._id) fetchExpenses();
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        tripId: null,
        paidBy: user._id,
        amount: formData.amount,
        description: formData.description,
        splitAmount: [user._id],
        date: formData.date || new Date(),
      };

      if (editingId) {
        await API.put(`/expenses/${editingId}`, payload);
        setMessage("✅ Expense updated successfully!");
      } else {
        await API.post("/expenses/create-expense", payload);
        setMessage("✅ Expense added successfully!");
      }

      setFormData({ amount: "", description: "", date: "" });
      setEditingId(null);
      fetchExpenses();
    } catch (error) {
      console.error(error);
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setFormData({
      amount: exp.amount,
      description: exp.description,
      date: exp.date?.split("T")[0],
    });
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await API.delete(`/expenses/${id}`);
      setMessage("🗑️ Expense deleted successfully!");
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const total = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="w-full px-8 py-6">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center border-b pb-4">
        <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-2">
          💵 Personal Expense Manager
        </h2>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-xl shadow-sm p-5 mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            type="number"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount (₹)"
            required
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="text"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold px-4 py-3 transition"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Expense"
              : "Add Expense"}
          </button>
        </div>

        {message && (
          <p
            className={`text-center text-sm font-medium mt-2 ${
              message.includes("✅")
                ? "text-green-600"
                : message.includes("🗑️")
                ? "text-red-500"
                : "text-gray-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>

      {/* Expense List */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-700">
            My Expenses ({expenses.length})
          </h3>
          <div className="text-gray-700 font-semibold text-lg">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>

        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No expenses added yet. 📝
          </p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {expenses.map((exp) => (
              <li
                key={exp._id}
                className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 rounded-md transition"
              >
                <div>
                  <p className="font-medium text-gray-800 text-lg">
                    ₹{exp.amount} —{" "}
                    <span className="text-gray-600">{exp.description}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(exp.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
