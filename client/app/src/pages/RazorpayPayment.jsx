import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { clearCart } from "../Store/cartSlice.js";
import { API_URL } from "../Utils/config.js";
import { useToast } from "../hooks/useToast.js";

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
  const location = useLocation();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [lastOrderId, setLastOrderId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");

  // Address book state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Get discount from cart navigation state
  const discountFromCart = location.state?.discountAmount || 0;
  const couponCodeFromCart = location.state?.couponCode || null;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = getAccessToken();
        if (!token) return;
        const res = await axios.get(`${API_URL}/api/auth/addresses`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setAddresses(res.data || []);
        if (res.data?.length > 0) setSelectedAddressId(res.data[0]._id || res.data[0].id);
      } catch { /* not critical */ }
      finally { setLoadingAddresses(false); }
    };
    fetchAddresses();
  }, []);

  const selectedAddress = addresses.find(a => (a._id || a.id) === selectedAddressId) || null;

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0), [items]);
  const totalAmount = useMemo(() => {
    return Number(((subtotal - discountFromCart) * 1.18).toFixed(2));
  }, [subtotal, discountFromCart]);

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
    localStorage.removeItem("refreshToken");
    setTimeout(() => navigate(LOGIN_ROUTE), 1000);
  };

  const refreshAccessToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(
        `${AUTH_BASE_URL}/refresh`,
        { refreshToken: storedRefreshToken },
        {
          withCredentials: true,
        },
      );
      const freshToken = response?.data?.accessToken;
      if (freshToken) {
        localStorage.setItem("accessToken", freshToken);
        if (response?.data?.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
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
      console.log(items);
      const createOrderResponse = await withAuthRetry((token) =>
    
        axios.post(
          `${API_BASE_URL}/create-order`,
          {
            amount: totalAmount,
            discountAmount: discountFromCart,
            shippingAddress: selectedAddress || null,
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity || 1,
              name: item.name,
              price: item.price,
              color: item.selectedVariant?.color,
              size: item.selectedVariant?.size || item.selectedVariant?.storage,
            })),
          },
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
              showToast("Payment successful! Order placed.");
              setTimeout(() => navigate("/orders"), 2000);
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

        {/* Shipping Address Selector */}
        <div className="mt-6">
          <h2 className="text-base font-semibold text-gray-800 mb-3">Shipping Address</h2>
          {loadingAddresses ? (
            <div className="text-sm text-gray-400 py-3">Loading addresses...</div>
          ) : addresses.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
              No saved addresses found.
              <button onClick={() => navigate('/profile')} className="ml-2 underline font-medium hover:text-amber-900">Add one in Profile →</button>
            </div>
          ) : (
            <div className="space-y-2">
              {addresses.map((addr) => {
                const addrId = addr._id || addr.id;
                return (
                  <label
                    key={addrId}
                    className={`flex items-start gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedAddressId === addrId
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addrId}
                      onChange={() => setSelectedAddressId(addrId)}
                      className="mt-1 accent-indigo-600"
                    />
                    <div className="text-sm">
                      <p className="font-semibold text-gray-900">{addr.fullName}</p>
                      <p className="text-gray-600">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                      <p className="text-gray-600">{addr.city}, {addr.state} — {addr.pinCode}</p>
                      {addr.phone && <p className="text-gray-500 text-xs mt-0.5">📞 {addr.phone}</p>}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          {discountFromCart > 0 && (
            <div className="flex justify-between text-green-600 mt-1 text-sm">
              <span>Discount {couponCodeFromCart ? `(${couponCodeFromCart})` : ''}</span>
              <span className="font-semibold">-₹{discountFromCart.toLocaleString('en-IN')}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-700 mt-1 text-sm">
            <span>GST (18%)</span>
            <span>₹{((subtotal - discountFromCart) * 0.18).toLocaleString('en-IN', {maximumFractionDigits:0})}</span>
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between text-gray-900">
            <span className="font-semibold">Total Payable</span>
            <span className="font-bold text-indigo-600 text-lg">₹{totalAmount.toLocaleString("en-IN")}</span>
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
