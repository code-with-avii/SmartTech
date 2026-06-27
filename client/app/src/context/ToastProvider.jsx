import { useCallback, useState } from "react";
import ToastNotification from "../components/ToastNotification.jsx";
import { ToastContext } from "./toastContext.js";

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    message: "",
    isVisible: false,
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, isVisible: true, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        type={toast.type}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};
