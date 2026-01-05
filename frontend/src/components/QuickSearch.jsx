import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import axios from 'axios';

export default function QuickSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ groups: [], users: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Search function with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults({ groups: [], users: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [groupsRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/trips?search=${query}`, {
            withCredentials: true,
          }).catch(() => ({ data: { trips: [] } })),
          axios.get(`http://localhost:5000/api/users/search?query=${query}`, {
            withCredentials: true,
          }).catch(() => ({ data: { users: [] } }))
        ]);

        setResults({
          groups: groupsRes.data.trips || [],
          users: usersRes.data.users || [],
        });
      } catch (error) {
        console.error('Search error:', error);
        setResults({ groups: [], users: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleUserClick = (userId) => {
    // Could navigate to a user profile or start a chat
    console.log('User clicked:', userId);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <>
      {/* Search Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden sm:flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200"
        aria-label="Quick search"
      >
        <FaSearch className="w-4 h-4" />
        <span className="text-sm">Search</span>
        <kbd className="hidden lg:inline-block px-2 py-1 text-xs bg-white/20 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Mobile Search Icon */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 rounded-lg hover:bg-white/20"
        aria-label="Search"
      >
        <FaSearch className="w-5 h-5" />
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[600px] flex flex-col animate-fadeIn transition-colors duration-200"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search groups, users, or navigate..."
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Type to search...</span>
                <span>Press ESC to close</span>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
              ) : !query.trim() ? (
                <div className="text-center py-12">
                  <FaSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Start typing to search</p>
                  <div className="mt-6 text-sm text-gray-400 dark:text-gray-500 space-y-2">
                    <p>Quick actions:</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-3">
                      <button
                        onClick={() => { navigate('/groups'); setIsOpen(false); }}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        My Groups
                      </button>
                      <button
                        onClick={() => { navigate('/reports'); setIsOpen(false); }}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Reports
                      </button>
                      <button
                        onClick={() => { navigate('/profile'); setIsOpen(false); }}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Groups Results */}
                  {results.groups.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 px-2">
                        Groups ({results.groups.length})
                      </h3>
                      <div className="space-y-2">
                        {results.groups.map((group) => (
                          <button
                            key={group._id}
                            onClick={() => handleGroupClick(group._id)}
                            className="w-full text-left p-3 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/70">
                                <span className="text-lg">👥</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">{group.tripName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {group.members?.length || 0} members • {group.category}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Users Results */}
                  {results.users.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 px-2">
                        Users ({results.users.length})
                      </h3>
                      <div className="space-y-2">
                        {results.users.map((user) => (
                          <button
                            key={user._id}
                            onClick={() => handleUserClick(user._id)}
                            className="w-full text-left p-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/70">
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results */}
                  {results.groups.length === 0 && results.users.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
