// Global keyboard navigation hook
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function useKeyboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let navigationMode = false;
    let timer = null;

    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input
      const activeElement = document.activeElement;
      const isInputField = 
        activeElement.tagName === 'INPUT' || 
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable;

      if (isInputField && e.key !== 'Escape') return;

      // Navigation mode with 'g' key
      if (e.key === 'g' || e.key === 'G') {
        if (!navigationMode) {
          navigationMode = true;
          // Reset navigation mode after 2 seconds
          timer = setTimeout(() => {
            navigationMode = false;
          }, 2000);
        } else {
          // Second 'g' press - Go to Groups
          navigate('/groups');
          navigationMode = false;
          clearTimeout(timer);
        }
        return;
      }

      // Navigation shortcuts when 'g' was pressed
      if (navigationMode) {
        switch(e.key.toLowerCase()) {
          case 'h':
            navigate('/home');
            break;
          case 'r':
            navigate('/reports');
            break;
          case 'p':
            navigate('/profile');
            break;
          default:
            break;
        }
        navigationMode = false;
        clearTimeout(timer);
      }

      // Create Group on Groups page
      if (e.key === 'c' || e.key === 'C') {
        if (location.pathname === '/groups' && !isInputField) {
          const createBtn = document.querySelector('[data-create-group]');
          if (createBtn) {
            e.preventDefault();
            createBtn.click();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timer) clearTimeout(timer);
    };
  }, [navigate, location]);
}
