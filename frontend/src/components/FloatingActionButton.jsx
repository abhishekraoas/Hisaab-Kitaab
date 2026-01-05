import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTimes, FaUsers, FaMoneyBillWave, FaChartBar } from 'react-icons/fa';

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'create-group',
      label: 'Create Group',
      icon: FaUsers,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => {
        navigate('/groups');
        setTimeout(() => {
          const createBtn = document.querySelector('[data-create-group]');
          if (createBtn) createBtn.click();
        }, 300);
      }
    },
    {
      id: 'view-groups',
      label: 'My Groups',
      icon: FaMoneyBillWave,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => navigate('/groups')
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FaChartBar,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => navigate('/reports')
    }
  ];

  const handleAction = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50">
      {/* Action Buttons */}
      {isOpen && (
        <div className="mb-4 flex flex-col items-end space-y-3">
          {quickActions.map((action, index) => (
            <div
              key={action.id}
              className="flex items-center space-x-3 animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap opacity-95">
                {action.label}
              </span>
              <button
                onClick={() => handleAction(action.action)}
                className={`${action.color} text-white p-4 rounded-full shadow-lg transform transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2`}
                aria-label={action.label}
              >
                <action.icon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white p-5 rounded-full shadow-2xl transform transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2`}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6 animate-spin" />
        ) : (
          <FaPlus className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
