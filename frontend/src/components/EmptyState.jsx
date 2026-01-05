import React from 'react';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  message, 
  actionLabel, 
  onAction,
  illustration = 'default'
}) => {
  const illustrations = {
    groups: (
      <svg className="w-40 h-40 mx-auto mb-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" className="fill-indigo-100 dark:fill-indigo-900/20" />
        <circle cx="100" cy="80" r="25" className="fill-indigo-300 dark:fill-indigo-700" />
        <ellipse cx="70" cy="130" rx="20" ry="25" className="fill-indigo-400 dark:fill-indigo-600" />
        <ellipse cx="130" cy="130" rx="20" ry="25" className="fill-indigo-400 dark:fill-indigo-600" />
        <path d="M60 150 Q100 170 140 150" className="stroke-indigo-500 dark:stroke-indigo-500" strokeWidth="3" fill="none" />
      </svg>
    ),
    expenses: (
      <svg className="w-40 h-40 mx-auto mb-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="60" width="120" height="80" rx="10" className="fill-purple-100 dark:fill-purple-900/20 stroke-purple-300 dark:stroke-purple-700" strokeWidth="2" />
        <rect x="60" y="80" width="80" height="8" rx="4" className="fill-purple-300 dark:fill-purple-600" />
        <rect x="60" y="100" width="60" height="6" rx="3" className="fill-purple-200 dark:fill-purple-700" />
        <rect x="60" y="115" width="50" height="6" rx="3" className="fill-purple-200 dark:fill-purple-700" />
        <circle cx="150" cy="50" r="15" className="fill-green-400 dark:fill-green-600" />
        <text x="150" y="55" className="fill-white text-xl" textAnchor="middle" fontWeight="bold">₹</text>
      </svg>
    ),
    reports: (
      <svg className="w-40 h-40 mx-auto mb-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="140" width="25" height="40" rx="5" className="fill-blue-300 dark:fill-blue-600" />
        <rect x="70" y="100" width="25" height="80" rx="5" className="fill-blue-400 dark:fill-blue-500" />
        <rect x="100" y="120" width="25" height="60" rx="5" className="fill-blue-300 dark:fill-blue-600" />
        <rect x="130" y="80" width="25" height="100" rx="5" className="fill-blue-500 dark:fill-blue-400" />
        <path d="M50 70 L80 50 L110 60 L140 40" className="stroke-green-500 dark:stroke-green-400" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="70" r="5" className="fill-green-500 dark:fill-green-400" />
        <circle cx="80" cy="50" r="5" className="fill-green-500 dark:fill-green-400" />
        <circle cx="110" cy="60" r="5" className="fill-green-500 dark:fill-green-400" />
        <circle cx="140" cy="40" r="5" className="fill-green-500 dark:fill-green-400" />
      </svg>
    ),
    activity: (
      <svg className="w-40 h-40 mx-auto mb-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="50" width="100" height="120" rx="10" className="fill-gray-100 dark:fill-gray-800 stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" />
        <circle cx="100" cy="90" r="20" className="fill-gray-200 dark:fill-gray-700" />
        <rect x="70" y="120" width="60" height="8" rx="4" className="fill-gray-200 dark:fill-gray-700" />
        <rect x="80" y="135" width="40" height="6" rx="3" className="fill-gray-200 dark:fill-gray-700" />
        <path d="M100 130 L100 150" className="stroke-gray-300 dark:stroke-gray-600" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4" />
      </svg>
    ),
    default: (
      <svg className="w-40 h-40 mx-auto mb-6" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="60" className="fill-gray-100 dark:fill-gray-800" />
        <path d="M100 70 L100 110 M80 100 L100 120 L120 100" className="stroke-gray-400 dark:stroke-gray-500" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration */}
      <div className="mb-4 animate-fade-in">
        {illustrations[illustration] || illustrations.default}
      </div>

      {/* Icon Badge */}
      {Icon && (
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 p-4 rounded-full mb-6 animate-bounce-slow">
          <Icon className="text-4xl text-indigo-600 dark:text-indigo-400" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 text-center">
        {title}
      </h3>

      {/* Message */}
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
        {message}
      </p>

      {/* Call to Action */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 overflow-hidden"
        >
          <span className="relative z-10">{actionLabel}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </button>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-2xl opacity-50"></div>
      </div>
    </div>
  );
};

export default EmptyState;
