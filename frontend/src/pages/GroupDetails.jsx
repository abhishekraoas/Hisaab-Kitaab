import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaPlus,
  FaUsers,
  FaUserPlus,
  FaTrash,
  FaEdit,
  FaReceipt,
  FaChartLine,
  FaLink,
  FaCopy,
} from 'react-icons/fa';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [settlements, setSettlements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses'); // expenses, settlements, members
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: 'Food',
    splitType: 'equal',
    splitDetails: [],
  });

  const [memberEmail, setMemberEmail] = useState('');

  useEffect(() => {
    fetchCurrentUser();
    fetchGroupDetails();
    fetchExpenses();
    fetchSettlements();
  }, [id]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        withCredentials: true,
      });
      setCurrentUserId(response.data.user._id);
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchGroupDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/trips/${id}`, {
        withCredentials: true,
      });
      setGroup(response.data.trip);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching group:', err);
      setError('Failed to load group details');
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/expenses/trip/${id}`,
        { withCredentials: true }
      );
      setExpenses(response.data.expenses);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    }
  };

  const fetchSettlements = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/expenses/settlements/${id}`,
        { withCredentials: true }
      );
      setSettlements(response.data);
    } catch (err) {
      console.error('Error fetching settlements:', err);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError('');

    if (!newExpense.amount || !newExpense.description) {
      setError('Amount and description are required');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/expenses/create-expense',
        {
          tripId: id,
          ...newExpense,
          amount: parseFloat(newExpense.amount),
        },
        { withCredentials: true }
      );

      setShowAddExpense(false);
      setNewExpense({
        amount: '',
        description: '',
        category: 'Food',
        splitType: 'equal',
        splitDetails: [],
      });
      fetchExpenses();
      fetchSettlements();
    } catch (err) {
      console.error('Error adding expense:', err);
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError('');

    if (!memberEmail.trim()) {
      setError('Email is required');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/trips/${id}/add-member`,
        { email: memberEmail },
        { withCredentials: true }
      );

      setShowAddMember(false);
      setMemberEmail('');
      fetchGroupDetails();
    } catch (err) {
      console.error('Error adding member:', err);
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/trips/${id}/remove-member/${memberId}`,
        { withCredentials: true }
      );
      toast.success('Member removed successfully');
      fetchGroupDetails();
    } catch (err) {
      console.error('Error removing member:', err);
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleGenerateInvite = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/trips/${id}/generate-invite`,
        {},
        { withCredentials: true }
      );
      setInviteLink(response.data.inviteLink);
      setShowInviteLink(true);
    } catch (err) {
      console.error('Error generating invite link:', err);
      toast.error(err.response?.data?.message || 'Failed to generate invite link');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invite link copied to clipboard!');
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/expenses/${expenseId}`, {
        withCredentials: true,
      });
      toast.success('Expense deleted successfully');
      fetchExpenses();
      fetchSettlements();
    } catch (err) {
      console.error('Error deleting expense:', err);
      toast.error(err.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/trips/${id}`,
        { withCredentials: true }
      );
      toast.success('Group deleted successfully');
      navigate('/groups');
    } catch (err) {
      console.error('Error deleting group:', err);
      toast.error(err.response?.data?.message || 'Failed to delete group');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Food: 'bg-orange-100 text-orange-600',
      Transport: 'bg-blue-100 text-blue-600',
      Accommodation: 'bg-purple-100 text-purple-600',
      Entertainment: 'bg-pink-100 text-pink-600',
      Shopping: 'bg-green-100 text-green-600',
      Other: 'bg-gray-100 text-gray-600',
    };
    return colors[category] || colors.Other;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-gray-600 text-xl">Group not found</div>
      </div>
    );
  }

  const isCreator = group && currentUserId && group.createdBy._id === currentUserId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/groups')}
            className="flex items-center gap-2 text-gray-700 mb-4 hover:text-gray-900 transition font-semibold"
          >
            <FaArrowLeft /> Back to Groups
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {group.tripName}
                </h1>
                {group.description && (
                  <p className="text-gray-600">{group.description}</p>
                )}
                <p className="text-gray-400 text-sm mt-2">
                  Created by {group.createdBy.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isCreator && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-lg"
                    title="Delete Group"
                  >
                    <FaTrash /> Delete
                  </button>
                )}
                <span
                  className={`text-xs px-4 py-2 rounded-full ${
                    group.category === 'Trip'
                      ? 'bg-blue-100 text-blue-600'
                      : group.category === 'Flat'
                      ? 'bg-green-100 text-green-600'
                      : group.category === 'Friends'
                      ? 'bg-purple-100 text-purple-600'
                      : group.category === 'Office'
                      ? 'bg-orange-100 text-orange-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {group.category}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-indigo-50 rounded-xl p-4 text-center border border-indigo-100">
                <FaUsers className="text-3xl text-indigo-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Members</p>
                <p className="text-gray-800 text-2xl font-bold">
                  {group.members.length}
                </p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                <FaReceipt className="text-3xl text-purple-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Expenses</p>
                <p className="text-gray-800 text-2xl font-bold">{expenses.length}</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                <FaChartLine className="text-3xl text-green-600 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-gray-800 text-2xl font-bold">
                  ₹{settlements?.totalExpense || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'expenses'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('settlements')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'settlements'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Settlements
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 rounded-xl font-semibold transition ${
              activeTab === 'members'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Members
          </button>
        </div>

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Expenses</h2>
              <button
                onClick={() => setShowAddExpense(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
              >
                <FaPlus /> Add Expense
              </button>
            </div>

            {expenses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <FaReceipt className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-xl">No expenses yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div
                    key={expense._id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-800">
                            {expense.description}
                          </h3>
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(
                              expense.category
                            )}`}
                          >
                            {expense.category}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-2">
                          Paid by {expense.paidBy.name} on{' '}
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-600 text-sm">
                          Split: {expense.splitType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          ₹{expense.amount}
                        </p>
                        {expense.paidBy._id === currentUser._id && (
                          <button
                            onClick={() => handleDeleteExpense(expense._id)}
                            className="mt-2 text-red-400 hover:text-red-600 transition"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settlements Tab */}
        {activeTab === 'settlements' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Who Owes Whom
            </h2>

            {!settlements || settlements.settlements.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <FaChartLine className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-xl">All settled up! 🎉</p>
              </div>
            ) : (
              <div className="space-y-4">
                {settlements.settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                          {settlement.from.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-gray-800 font-semibold">
                            {settlement.from.name}
                          </p>
                          <p className="text-gray-500 text-sm">
                            owes to {settlement.to.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          ₹{settlement.amount}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Members</h2>
              {isCreator && (
                <div className="flex gap-3">
                  <button
                    onClick={handleGenerateInvite}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition shadow-lg"
                  >
                    <FaLink /> Generate Invite Link
                  </button>
                  <button
                    onClick={() => setShowAddMember(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
                  >
                    <FaUserPlus /> Add Member
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {group.members.map((member) => (
                <div
                  key={member._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-gray-800 font-semibold">{member.name}</p>
                        <p className="text-gray-500 text-sm">{member.email}</p>
                        {member.mobile && (
                          <p className="text-gray-500 text-sm">{member.mobile}</p>
                        )}
                      </div>
                    </div>
                    {isCreator && member._id !== group.createdBy._id && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-400 hover:text-red-600 transition"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Add Expense
            </h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleAddExpense}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Dinner at restaurant"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Amount (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newExpense.amount}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, amount: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Accommodation">Accommodation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Split Type
                </label>
                <select
                  value={newExpense.splitType}
                  onChange={(e) =>
                    setNewExpense({ ...newExpense, splitType: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="equal">Equal Split</option>
                  <option value="custom">Custom Split</option>
                  <option value="percentage">Percentage Split</option>
                </select>
                <p className="text-gray-500 text-sm mt-2">
                  {newExpense.splitType === 'equal'
                    ? 'Amount will be split equally among all members'
                    : newExpense.splitType === 'custom'
                    ? 'Specify custom amounts for each member'
                    : 'Specify percentage for each member'}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddExpense(false);
                    setError('');
                  }}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Add Member</h2>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleAddMember}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="member@example.com"
                  required
                />
                <p className="text-gray-500 text-sm mt-2">
                  User must be registered on Hisaab-Kitaab
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddMember(false);
                    setError('');
                  }}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Link Modal */}
      {showInviteLink && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Invite Link Generated</h2>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Share this link with others:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-700"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-6 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-lg flex items-center gap-2"
                >
                  <FaCopy /> Copy
                </button>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                ⚠️ This link will expire in 7 days
              </p>
            </div>

            <button
              onClick={() => setShowInviteLink(false)}
              className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <FaTrash className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Delete Group?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this group? This action cannot be undone and all expenses will be permanently lost.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleDeleteGroup();
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
