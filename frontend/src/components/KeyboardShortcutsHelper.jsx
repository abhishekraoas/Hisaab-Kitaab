import React, { useState, useEffect } from 'react';
import { FaKeyboard, FaTimes } from 'react-icons/fa';

export default function KeyboardShortcutsHelper() {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { key: 'Ctrl + K', description: 'Quick Search', mac: '⌘ K' },
    { key: 'G then H', description: 'Go to Home', mac: 'G then H' },
    { key: 'G then G', description: 'Go to Groups', mac: 'G then G' },
    { key: 'G then R', description: 'Go to Reports', mac: 'G then R' },
    { key: 'G then P', description: 'Go to Profile', mac: 'G then P' },
    { key: 'C', description: 'Create New Group (on Groups page)', mac: 'C' },
    { key: '?', description: 'Show/Hide Shortcuts', mac: '?' },
    { key: 'Esc', description: 'Close Modals', mac: 'Esc' },
  ];

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Show shortcuts on '?' press
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }

      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Help Button - Fixed position */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 left-4 md:left-6 z-40 bg-gray-800 dark:bg-gray-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
        aria-label="Keyboard shortcuts"
        title="Keyboard shortcuts (?)"
      >
        <FaKeyboard className="w-5 h-5" />
      </button>

      {/* Shortcuts Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden animate-fadeIn transition-colors duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaKeyboard className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                  aria-label="Close"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <p className="mt-2 text-indigo-100">
                Speed up your workflow with these handy shortcuts
              </p>
            </div>

            {/* Shortcuts List */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {shortcut.description}
                    </span>
                    <kbd className="px-3 py-2 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm font-mono text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {isMac ? shortcut.mac : shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>

              {/* Tips Section */}
              <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/30 border-l-4 border-indigo-600 dark:border-indigo-400 rounded-lg">
                <h3 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">💡 Pro Tips</h3>
                <ul className="text-sm text-indigo-800 dark:text-indigo-300 space-y-1">
                  <li>• Press <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs">?</kbd> anytime to toggle this help</li>
                  <li>• Use <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs">Tab</kbd> to navigate between form fields</li>
                  <li>• Most modals close with <kbd className="px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs">Esc</kbd></li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Press <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">?</kbd> or{' '}
                <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-xs">Esc</kbd> to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
