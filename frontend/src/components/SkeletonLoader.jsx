import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

export const SkeletonTable = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
    </div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
          <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
);

export const SkeletonStats = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
    </div>
  </div>
);

export const SkeletonList = ({ count = 3 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonProfile = () => (
  <div className="max-w-4xl mx-auto animate-pulse">
    {/* Profile Header */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
      <div className="flex items-center space-x-6">
        <div className="h-24 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    {/* Profile Form */}
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6 mb-2"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default {
  SkeletonCard,
  SkeletonTable,
  SkeletonChart,
  SkeletonStats,
  SkeletonList,
  SkeletonProfile
};
