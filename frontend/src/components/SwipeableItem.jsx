import React, { useState, useRef, useEffect } from 'react';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';

const SwipeableItem = ({ 
  children, 
  onDelete, 
  onEdit, 
  onView,
  deleteText = "Delete",
  editText = "Edit",
  viewText = "View",
  showEdit = true,
  showView = false
}) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemRef = useRef(null);

  const minSwipeDistance = 50;
  const maxSwipeDistance = 150;

  useEffect(() => {
    if (swipeDistance === 0) return;

    const timer = setTimeout(() => {
      setSwipeDistance(0);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [swipeDistance]);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    const distance = touchStart - e.targetTouches[0].clientX;
    
    // Limit swipe distance
    if (Math.abs(distance) <= maxSwipeDistance) {
      setSwipeDistance(distance);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - delete
      if (onDelete) {
        setSwipeDistance(maxSwipeDistance);
      }
    } else if (isRightSwipe) {
      // Swipe right - actions
      setSwipeDistance(-maxSwipeDistance);
    } else {
      // Reset if swipe too small
      setSwipeDistance(0);
    }
  };

  const handleDelete = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (onDelete) onDelete();
    }, 300);
  };

  const handleEdit = () => {
    setSwipeDistance(0);
    setIsAnimating(true);
    setTimeout(() => {
      if (onEdit) onEdit();
      setIsAnimating(false);
    }, 300);
  };

  const handleView = () => {
    setSwipeDistance(0);
    setIsAnimating(true);
    setTimeout(() => {
      if (onView) onView();
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="relative overflow-hidden touch-pan-y">
      {/* Delete Action (Left Swipe - shows on right) */}
      {swipeDistance > minSwipeDistance && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end bg-red-500 pr-4 rounded-r-lg z-0">
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <FaTrash className="text-xl" />
            <span className="text-sm">{deleteText}</span>
          </button>
        </div>
      )}

      {/* Actions (Right Swipe - shows on left) */}
      {swipeDistance < -minSwipeDistance && (
        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-start bg-gradient-to-r from-blue-500 to-indigo-600 pl-4 rounded-l-lg z-0">
          <div className="flex items-center space-x-2">
            {showEdit && onEdit && (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-1 text-white font-semibold px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <FaEdit className="text-lg" />
                <span className="text-sm">{editText}</span>
              </button>
            )}
            {showView && onView && (
              <button
                onClick={handleView}
                className="flex items-center space-x-1 text-white font-semibold px-3 py-2 rounded-lg hover:bg-white/20 transition-colors"
              >
                <FaEye className="text-lg" />
                <span className="text-sm">{viewText}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        ref={itemRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className={`relative z-10 ${isAnimating ? 'transition-transform duration-300' : ''}`}
        style={{
          transform: `translateX(${-swipeDistance}px)`,
          transition: isAnimating ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default SwipeableItem;
