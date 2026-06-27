import { useEffect } from "react";

const typeStyles = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

const ToastNotification = ({ message, isVisible, type = "success", onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex items-center justify-end">
      <div
        className={`${typeStyles[type] || typeStyles.success} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[280px] max-w-md`}
      >
        <div className="flex-1">
          <p className="font-medium text-white">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 text-white hover:text-gray-200 transition-colors"
          aria-label="Close"
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
