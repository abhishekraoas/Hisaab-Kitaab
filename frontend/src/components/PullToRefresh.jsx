import React, { useState, useRef } from 'react';
import { FaSync } from 'react-icons/fa';

const PullToRefresh = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef(null);

  const maxPullDistance = 120;
  const triggerDistance = 80;

  const handleTouchStart = (e) => {
    // Only trigger if at top of page
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY);
      setIsPulling(true);
    }
  };

  const handleTouchMove = (e) => {
    if (!isPulling || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    if (distance > 0 && window.scrollY === 0) {
      // Prevent default scroll behavior
      e.preventDefault();
      
      // Apply rubber band effect
      const dampedDistance = Math.min(
        distance * 0.5,
        maxPullDistance
      );
      
      setPullDistance(dampedDistance);
      setCurrentY(currentY);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= triggerDistance && !isRefreshing) {
      setIsRefreshing(true);
      
      try {
        // Keep the refresh indicator visible while refreshing
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        // Smooth animation back
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 500);
      }
    } else {
      // Reset without refreshing
      setPullDistance(0);
    }

    setStartY(0);
    setCurrentY(0);
  };

  const getRotation = () => {
    if (isRefreshing) return 'rotate-360';
    return pullDistance > 0 ? `rotate-${Math.min(pullDistance * 3, 360)}` : '';
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative overflow-hidden"
      style={{
        transform: `translateY(${isRefreshing ? triggerDistance : pullDistance}px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      {/* Pull to Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center"
        style={{
          height: `${maxPullDistance}px`,
          transform: `translateY(-${maxPullDistance}px)`,
          opacity: pullDistance > 0 ? Math.min(pullDistance / triggerDistance, 1) : 0,
          transition: 'opacity 0.2s ease-out'
        }}
      >
        <div className="flex flex-col items-center py-4">
          <div
            className={`
              bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border-2 
              ${pullDistance >= triggerDistance ? 'border-indigo-500' : 'border-gray-300 dark:border-gray-600'}
              ${isRefreshing ? 'animate-spin' : ''}
            `}
            style={{
              transform: `rotate(${isRefreshing ? 0 : Math.min(pullDistance * 3, 360)}deg)`,
              transition: isRefreshing ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <FaSync 
              className={`
                text-xl
                ${pullDistance >= triggerDistance ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500'}
              `}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
            {isRefreshing 
              ? 'Refreshing...' 
              : pullDistance >= triggerDistance 
              ? 'Release to refresh' 
              : 'Pull to refresh'
            }
          </p>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default PullToRefresh;
