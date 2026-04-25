import React, { useEffect } from 'react';

const ToastNotification = ({ message, isVisible, onClose }) => {
  console.log('ToastNotification props:', { message, isVisible });
  
  useEffect(() => {
    console.log('ToastNotification useEffect, isVisible:', isVisible);
    if (isVisible) {
      const timer = setTimeout(() => {
        console.log('Toast timer calling onClose');
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    console.log('ToastNotification not rendering, isVisible:', isVisible);
    return null;
  }
  
  console.log('ToastNotification rendering with message:', message);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center justify-end">
      <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-medium text-white">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ToastNotification;
