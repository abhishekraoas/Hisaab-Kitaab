import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import API from "../utils/api";

const COLORS = ["#4ade80", "#facc15", "#f87171", "#60a5fa", "#a78bfa", "#f472b6", "#fbbf24"];

export default function Home() {
  const [user, setUser] = useState(null);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);

  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);

  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeSource, setIncomeSource] = useState("Salary");
  const [incomeDate, setIncomeDate] = useState("");

  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Food");
  const [expenseOtherCategory, setExpenseOtherCategory] = useState("");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([""]);

  const token = localStorage.getItem("token");

  // Fetch user, income, expenses, and groups on load
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const userRes = await API.get("/auth/me", { headers: { Authorization: `Bearer ${token}` } });
        setUser(userRes.data.user);

        const incomeRes = await API.get("/income", { headers: { Authorization: `Bearer ${token}` } });
        setIncome(incomeRes.data);

        const expenseRes = await API.get("/expenses", { headers: { Authorization: `Bearer ${token}` } });
        setExpenses(expenseRes.data);

        const groupRes = await API.get("/groups", { headers: { Authorization: `Bearer ${token}` } });
        setGroups(groupRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  // Add Income
  const addIncome = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/income", {
        amount: Number(incomeAmount),
        source: incomeSource,
        date: incomeDate || new Date().toISOString()
      }, { headers: { Authorization: `Bearer ${token}` } });

      setIncome(prev => [...prev, res.data]);
      setIncomeAmount(""); setIncomeSource("Salary"); setIncomeDate("");
      setShowIncomeForm(false);
    } catch (err) { console.error(err); }
  };

  // Add Expense
  const addExpense = async (e) => {
    e.preventDefault();
    try {
      const category = expenseCategory === "Other" ? expenseOtherCategory : expenseCategory;
      const res = await API.post("/expenses", {
        amount: Number(expenseAmount),
        category,
        description: expenseDescription,
        date: expenseDate || new Date().toISOString()
      }, { headers: { Authorization: `Bearer ${token}` } });

      setExpenses(prev => [...prev, res.data]);
      setExpenseAmount(""); setExpenseCategory("Food"); setExpenseOtherCategory("");
      setExpenseDescription(""); setExpenseDate(""); setShowExpenseForm(false);
    } catch (err) { console.error(err); }
  };

  // Add Group
  const addGroup = async (e) => {
    e.preventDefault();
    try {
      const members = groupMembers.filter(m => m);
      const res = await API.post("/groups", { name: groupName, members }, { headers: { Authorization: `Bearer ${token}` } });
      setGroups(prev => [...prev, res.data]);
      setGroupName(""); setGroupMembers([""]); setShowGroupForm(false);
    } catch (err) { console.error(err); }
  };

  const addGroupMemberField = () => setGroupMembers([...groupMembers, ""]);
  const changeGroupMember = (i, v) => { const c = [...groupMembers]; c[i] = v; setGroupMembers(c); }

  const deleteGroup = async (id) => {
    try {
      await API.delete(`/groups/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setGroups(prev => prev.filter(g => g._id !== id));
    } catch (err) { console.error(err); }
  };

  const totalIncome = income.reduce((a, b) => a + b.amount, 0);
  const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
  const totalSavings = totalIncome - totalExpenses;

  const expenseChartData = Object.values(expenses.reduce((acc, e) => {
    if (acc[e.category]) acc[e.category].value += e.amount;
    else acc[e.category] = { name: e.category, value: e.amount };
    return acc;
  }, {}));

  const calculateOwes = (group) => {
    const total = group.expenses.reduce((a, b) => a + b.amount, 0);
    const perMember = total / group.members.length;
    const owes = {};
    group.members.forEach(m => owes[m] = perMember);
    group.expenses.forEach(exp => { owes[exp.paidBy] -= exp.amount; });
    return owes;
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>

      {/* Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="p-6 rounded-xl shadow bg-green-500 text-white">
          <h3>Total Income</h3>
          <p className="text-2xl font-bold mt-2">₹{totalIncome}</p>
        </div>
        <div className="p-6 rounded-xl shadow bg-red-500 text-white">
          <h3>Total Expenses</h3>
          <p className="text-2xl font-bold mt-2">₹{totalExpenses}</p>
        </div>
        <div className="p-6 rounded-xl shadow bg-blue-500 text-white">
          <h3>Savings</h3>
          <p className="text-2xl font-bold mt-2">₹{totalSavings}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setShowIncomeForm(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg">Add Income</button>
        <button onClick={() => setShowExpenseForm(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Add Expense</button>
        <button onClick={() => setShowGroupForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add Group</button>
      </div>

      {/* Forms */}
      {showIncomeForm && (
        <form onSubmit={addIncome} className="bg-white p-6 rounded-xl shadow mb-6 max-w-md">
          <h3 className="font-semibold mb-2">Add Income</h3>
          <input type="number" value={incomeAmount} onChange={e => setIncomeAmount(e.target.value)} placeholder="Amount" className="border p-2 rounded w-full mb-2" required />
          <select value={incomeSource} onChange={e => setIncomeSource(e.target.value)} className="border p-2 rounded w-full mb-2">
            <option>Salary</option><option>Freelance</option><option>Other</option>
          </select>
          <input type="date" value={incomeDate} onChange={e => setIncomeDate(e.target.value)} className="border p-2 rounded w-full mb-2" />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      )}

      {showExpenseForm && (
        <form onSubmit={addExpense} className="bg-white p-6 rounded-xl shadow mb-6 max-w-md">
          <h3 className="font-semibold mb-2">Add Expense</h3>
          <input type="number" value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} placeholder="Amount" className="border p-2 rounded w-full mb-2" required />
          <select value={expenseCategory} onChange={e => setExpenseCategory(e.target.value)} className="border p-2 rounded w-full mb-2">
            <option>Food</option><option>Travel</option><option>Bills</option><option>Shopping</option><option>Other</option>
          </select>
          {expenseCategory === "Other" && <input value={expenseOtherCategory} onChange={e => setExpenseOtherCategory(e.target.value)} placeholder="Custom Category" className="border p-2 rounded w-full mb-2" />}
          <input value={expenseDescription} onChange={e => setExpenseDescription(e.target.value)} placeholder="Description" className="border p-2 rounded w-full mb-2" />
          <input type="datetime-local" value={expenseDate} onChange={e => setExpenseDate(e.target.value)} className="border p-2 rounded w-full mb-2" />
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Add</button>
        </form>
      )}

      {showGroupForm && (
        <form onSubmit={addGroup} className="bg-white p-6 rounded-xl shadow mb-6 max-w-md">
          <h3 className="font-semibold mb-2">Create Group</h3>
          <input value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="Group Name" className="border p-2 rounded w-full mb-2" required />
          {groupMembers.map((m, i) => (
            <input key={i} value={m} onChange={e => changeGroupMember(i, e.target.value)} placeholder="Member Phone" className="border p-2 rounded w-full mb-2" pattern="\d{10}" title="Enter 10 digit phone number" />
          ))}
          <button type="button" onClick={addGroupMemberField} className="bg-indigo-500 text-white px-3 py-1 rounded mb-2">+ Add Member</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create Group</button>
        </form>
      )}

      {/* Expenses Table */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-bold mb-4">All Expenses</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b"><th>Description</th><th>Category</th><th>Amount</th><th>Date & Time</th></tr>
          </thead>
          <tbody>
            {expenses.sort((a,b)=> new Date(b.date)-new Date(a.date)).map(e => (
              <tr key={e._id || e.id} className="border-b hover:bg-gray-50">
                <td className="py-2">{e.description}</td>
                <td className="py-2">{e.category}</td>
                <td className="py-2">₹{e.amount}</td>
                <td className="py-2">{new Date(e.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expense Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Expense Breakdown</h3>
        <div style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie dataKey="value" data={expenseChartData} label>
                {expenseChartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Groups */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-bold mb-4">Groups</h3>
        {groups.map(g => (
          <div key={g._id || g.id} className="mb-4 p-4 border rounded-lg relative">
            <h4 className="font-semibold">{g.name}</h4>
            <p>Members: {g.members.join(", ")}</p>
            <button onClick={()=>deleteGroup(g._id || g.id)} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">Delete</button>
            {g.expenses.length>0 && <div className="mt-2">
              <h5 className="font-semibold">Expenses</h5>
              <ul>
                {g.expenses.map(ex => (
                  <li key={ex._id || ex.id}>{ex.description} - ₹{ex.amount} (Paid by {ex.paidBy})</li>
                ))}
              </ul>
              <h5 className="font-semibold mt-2">Who owes what:</h5>
              <ul>
                {Object.entries(calculateOwes(g)).map(([member, amt])=>(
                  <li key={member}>{member} {amt>0? `owes ₹${amt}`: `gets back ₹${-amt}`}</li>
                ))}
              </ul>
            </div>}
          </div>
        ))}
      </div>
    </div>
  )
}
