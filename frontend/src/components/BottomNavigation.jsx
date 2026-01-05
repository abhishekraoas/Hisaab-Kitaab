import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaChartBar, FaUser } from 'react-icons/fa';

export default function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/home', label: 'Home', icon: FaHome },
    { path: '/groups', label: 'Groups', icon: FaUsers },
    { path: '/reports', label: 'Reports', icon: FaChartBar },
    { path: '/profile', label: 'Profile', icon: FaUser },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40 transition-colors duration-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
