import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaUsers, FaCalendar, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { SkeletonCard } from '../components/SkeletonLoader';
import SwipeableItem from '../components/SwipeableItem';
import PullToRefresh from '../components/PullToRefresh';
import EmptyState from '../components/EmptyState';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({
    tripName: '',
    description: '',
    category: 'Other',
  });
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/trips', {
        withCredentials: true,
      });
      setGroups(response.data.trips);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError('Failed to load groups');
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await fetchGroups();
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError('');

    if (!newGroup.tripName.trim()) {
      setError('Group name is required');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/trips/create-trip',
        {
          ...newGroup,
          members: selectedMembers.map(m => m._id),
        },
        { withCredentials: true }
      );

      setGroups([response.data.trip, ...groups]);
      setShowCreateModal(false);
      setNewGroup({ tripName: '', description: '', category: 'Other' });
      setSelectedMembers([]);
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error('Error creating group:', err);
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  const searchUsers = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/search?query=${query}`,
        { withCredentials: true }
      );
      setSearchResults(response.data.users || []);
    } catch (err) {
      console.error('Error searching users:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchUsers(query);
  };

  const addMember = (user) => {
    if (!selectedMembers.find(m => m._id === user._id)) {
      setSelectedMembers([...selectedMembers, user]);
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(m => m._id !== userId));
  };

  const getCategoryColor = (category) => {
    const colors = {
      Trip: 'bg-blue-100 text-blue-600',
      Flat: 'bg-green-100 text-green-600',
      Friends: 'bg-purple-100 text-purple-600',
      Office: 'bg-orange-100 text-orange-600',
      Other: 'bg-gray-100 text-gray-600',
    };
    return colors[category] || colors.Other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-4 hover:text-gray-900 dark:hover:text-white transition font-semibold"
          >
            <FaArrowLeft /> Back to Home
          </button>
          
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white">My Groups</h1>
            <button
              data-create-group
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg"
            >
              <FaPlus /> Create Group
            </button>
          </div>
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <EmptyState
            illustration="groups"
            icon={FaUsers}
            title="No Groups Yet"
            message="Create your first group to start tracking shared expenses with friends, family, or colleagues. It's quick and easy!"
            actionLabel="Create Your First Group"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <SwipeableItem
                key={group._id}
                onDelete={() => {
                  if (window.confirm(`Delete "${group.tripName}"?`)) {
                    // Add delete API call here
                    setGroups(groups.filter(g => g._id !== group._id));
                  }
                }}
                onView={() => navigate(`/group/${group._id}`)}
                showView={true}
                showEdit={false}
              >
                <div
                  onClick={() => navigate(`/group/${group._id}`)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border border-gray-100 dark:border-gray-700"
                >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate flex-1">
                    {group.tripName}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getCategoryColor(
                      group.category
                    )}`}
                  >
                    {group.category}
                  </span>
                </div>

                {group.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {group.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <FaUsers />
                    <span>{group.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaCalendar />
                    <span>{new Date(group.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-400 text-xs">
                    Created by {group.createdBy?.name || 'Unknown'}
                  </p>
                </div>
              </div>
              </SwipeableItem>
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                Create New Group
              </h2>
              <button
                onClick={() => navigate('/home')}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition font-semibold"
                type="button"
              >
                🏠 Home
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-xl mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={newGroup.tripName}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, tripName: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  placeholder="e.g., Goa Trip 2024"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  placeholder="Brief description..."
                  rows="3"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Category
                </label>
                <select
                  value={newGroup.category}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                >
                  <option value="Trip">Trip</option>
                  <option value="Flat">Flat</option>
                  <option value="Friends">Friends</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Add Members Section */}
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                  Add Members (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by name or email..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent"
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 max-h-48 overflow-y-auto">
                      {searchResults.map((user) => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => addMember(user)}
                          className="w-full px-4 py-3 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition border-b border-gray-100 dark:border-gray-600 last:border-0"
                        >
                          <p className="font-semibold text-gray-800 dark:text-white">{user.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Members */}
                {selectedMembers.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Selected Members:</p>
                    {selectedMembers.map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">{member.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMember(member._id)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setError('');
                    setSelectedMembers([]);
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition shadow-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </PullToRefresh>
  );
};

export default Groups;
