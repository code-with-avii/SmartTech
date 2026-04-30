import { useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../Store/cartSlice";
import { API_URL } from "../Utils/config.js";

const API_BASE_URL = `${API_URL}/api/payments`;
const AUTH_BASE_URL = `${API_URL}/api/auth`;
const LOGIN_ROUTE = "/login";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const RazorpayPayment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [lastOrderId, setLastOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");

  const totalAmount = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
    return Number((subtotal * 1.18).toFixed(2));
  }, [items]);

  const getAccessToken = () => {
    const rawToken = localStorage.getItem("accessToken");
    if (!rawToken || rawToken === "undefined" || rawToken === "null") {
      return null;
    }

    let token = rawToken;
    try {
      // Handles values accidentally saved as JSON strings
      const parsed = JSON.parse(rawToken);
      if (typeof parsed === "string") token = parsed;
    } catch {
      token = rawToken;
    }

    token = String(token).replace(/^Bearer\s+/i, "").replace(/^"+|"+$/g, "").trim();
    return token || null;
  };

  const redirectToLogin = (message) => {
    setError(message || "Session expired. Please login again to continue payment.");
    localStorage.removeItem("accessToken");
    setTimeout(() => navigate(LOGIN_ROUTE), 1000);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${AUTH_BASE_URL}/refresh`,
        {},
        {
          withCredentials: true,
        },
      );
      const freshToken = response?.data?.accessToken;
      if (freshToken) {
        localStorage.setItem("accessToken", freshToken);
        return freshToken;
      }
      return null;
    } catch {
      return null;
    }
  };

  const withAuthRetry = async (requestFn) => {
    let token = getAccessToken();
    if (!token) {
      token = await refreshAccessToken();
    }
    if (!token) {
      redirectToLogin("Please login before making a payment.");
      return null;
    }

    try {
      return await requestFn(token);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        const freshToken = await refreshAccessToken();
        if (!freshToken) {
          redirectToLogin("Session expired. Please login again to continue payment.");
          return null;
        }
        return requestFn(freshToken);
      }
      throw err;
    }
  };

  const fetchStatus = async (orderId) => {
    if (!orderId) return;

    try {
      const response = await withAuthRetry((token) =>
        axios.get(`${API_BASE_URL}/status/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
      );
      if (!response) return;
      setPaymentStatus(response.data.status || "Pending");
    } catch {
      // If status fetching fails, do not block checkout flow
    }
  };

  const handlePayNow = async () => {
    setError("");
    setPaymentSuccess(null);

    if (items.length === 0 || totalAmount <= 0) {
      setError("Your cart is empty.");
      return;
    }

    setIsLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to load Razorpay checkout.");
      }

      const createOrderResponse = await withAuthRetry((token) =>
        axios.post(
          `${API_BASE_URL}/create-order`,
          { amount: totalAmount },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          },
        ),
      );
      if (!createOrderResponse) {
        setIsLoading(false);
        return;
      }

      const { order_id, amount, currency, key } = createOrderResponse.data;
      setLastOrderId(order_id);
      setPaymentStatus("Pending");

      const options = {
        key: key || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "MERN E-Commerce Store",
        description: "Order payment",
        order_id,
        handler: async (response) => {
          try {
            const verifyResponse = await withAuthRetry((token) =>
              axios.post(
                `${API_BASE_URL}/verify-payment`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                  withCredentials: true,
                },
              ),
            );
            if (!verifyResponse) return;

            if (verifyResponse.data.success) {
              setPaymentSuccess({
                paymentId: verifyResponse.data.paymentId,
                orderId: verifyResponse.data.orderId,
              });
              setPaymentStatus("Paid");
              dispatch(clearCart());
            } else {
              setError("Payment verification failed.");
              setPaymentStatus("Failed");
            }
          } catch (verifyError) {
            setError(verifyError.response?.data?.message || "Payment verification failed.");
            setPaymentStatus("Failed");
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setError("Payment popup was closed before completion.");
          },
        },
        prefill: {
          email: JSON.parse(localStorage.getItem("user") || "{}")?.email || "",
          name: JSON.parse(localStorage.getItem("user") || "{}")?.name || "",
        },
        theme: { color: "#4f46e5" },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", (response) => {
        setError(response.error?.description || "Payment failed.");
        setPaymentStatus("Failed");
        setIsLoading(false);
      });

      razorpayInstance.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to start payment.");
      setPaymentStatus("Failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Checkout Payment</h1>
        <p className="text-gray-600 mt-2">Pay securely with Razorpay.</p>

        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex justify-between text-gray-700">
            <span>Amount payable</span>
            <span className="font-bold text-indigo-600">₹{totalAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>Status</span>
            <span>{paymentStatus}</span>
          </div>
          {lastOrderId ? (
            <div className="mt-3 text-xs text-gray-500 break-all">Order ID: {lastOrderId}</div>
          ) : null}
        </div>

        {error ? <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div> : null}

        {paymentSuccess ? (
          <div className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
            Payment successful. Payment ID: <span className="font-semibold">{paymentSuccess.paymentId}</span>
          </div>
        ) : null}

        <button
          onClick={handlePayNow}
          disabled={isLoading || items.length === 0}
          className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>

        {lastOrderId ? (
          <button
            onClick={() => fetchStatus(lastOrderId)}
            className="mt-3 w-full border border-indigo-200 text-indigo-700 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            Refresh Payment Status
          </button>
        ) : null}

        <button
          onClick={() => navigate("/cart")}
          className="mt-3 w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          Back to Cart
        </button>
      </div>
    </div>
  );
};

export default RazorpayPayment;
