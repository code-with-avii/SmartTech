import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import TopNavbar from "../components/TopNavbar.jsx";
import Footer from "../components/Footer.jsx";
import { API_URL } from "../Utils/config.js";
import { FaBox, FaTruck, FaCheckCircle, FaExclamationTriangle, FaSearch } from "react-icons/fa";

const steps = [
  { name: "Order Placed", status: "Pending", desc: "We have received your order request." },
  { name: "Processing", status: "Processing", desc: "Your order is being prepared and packed." },
  { name: "Shipped", status: "Shipped", desc: "Your package is on its way to you." },
  { name: "Delivered", status: "Delivered", desc: "Package has been delivered successfully." },
];

const getStatusIndex = (status) => {
  switch (status) {
    case "Pending":
      return 0;
    case "Processing":
      return 1;
    case "Shipped":
      return 2;
    case "Delivered":
      return 3;
    default:
      return -1; // e.g. Cancelled
  }
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId.trim() || !email.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await axios.post(`${API_URL}/api/orders/track`, {
        orderId: orderId.trim(),
        email: email.trim(),
      });
      setOrder(res.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not find any order with the provided details."
      );
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? getStatusIndex(order.status) : -1;
  const isCancelled = order?.status === "Cancelled";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
      <TopNavbar />
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            Track Your Order
          </h1>
          <p className="text-gray-600 dark:text-neutral-400 text-lg">
            Enter your Order ID and the associated email address to view shipping status.
          </p>
        </div>

        {/* Track Form */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700 p-6 md:p-8 mb-8">
          <form onSubmit={handleTrack} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                  Order ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 64b8f7292a188f62c8e1a5f4"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-neutral-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. yourname@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Checking status...</span>
              ) : (
                <>
                  <FaSearch className="text-sm" />
                  <span>Track Order</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 flex items-center gap-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-4 rounded-xl">
              <FaExclamationTriangle className="flex-shrink-0 text-lg" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Tracking Details Display */}
        {order && (
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700 overflow-hidden animate-fadeIn">
            {/* Header info */}
            <div className="p-6 md:p-8 bg-gray-50 dark:bg-neutral-800/50 border-b border-gray-100 dark:border-neutral-700 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
                  Order Details
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white font-mono mt-0.5">
                  ID: {order._id}
                </h3>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
                    Total Amount
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₹{order.totalAmount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
                    Date Placed
                  </p>
                  <p className="text-base font-medium text-gray-800 dark:text-neutral-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Stepper Status Progress */}
            <div className="p-6 md:p-8 border-b border-gray-100 dark:border-neutral-700">
              {isCancelled ? (
                <div className="flex items-center gap-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 p-6 rounded-xl text-center md:text-left">
                  <FaExclamationTriangle className="text-3xl flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-lg">Order Cancelled</h4>
                    <p className="text-sm mt-1">
                      This order has been cancelled and is not being processed. Please contact customer care for support.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Desktop progress line */}
                  <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-1 bg-gray-200 dark:bg-neutral-700 -z-0">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${(currentStepIndex / 3) * 100}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isActive = idx === currentStepIndex;

                      return (
                        <div key={idx} className="flex md:flex-col items-center md:text-center gap-4 md:gap-2">
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-md border-4 transition-all duration-300 ${
                              isCompleted
                                ? "bg-blue-600 text-white border-blue-100 dark:border-neutral-800"
                                : "bg-white dark:bg-neutral-700 text-gray-400 dark:text-neutral-500 border-gray-100 dark:border-neutral-800"
                            } ${isActive ? "ring-4 ring-blue-500/30 scale-110" : ""}`}
                          >
                            {idx === 0 && <FaBox />}
                            {idx === 1 && <FaBox />}
                            {idx === 2 && <FaTruck />}
                            {idx === 3 && <FaCheckCircle />}
                          </div>
                          <div>
                            <h4
                              className={`font-bold text-sm md:text-base ${
                                isCompleted
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-400 dark:text-neutral-500"
                              }`}
                            >
                              {step.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-[200px] md:mx-auto">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Product items inside order */}
            <div className="p-6 md:p-8">
              <h4 className="text-sm font-semibold text-gray-400 dark:text-neutral-500 uppercase tracking-wider mb-4">
                Items in this order
              </h4>
              <div className="divide-y divide-gray-100 dark:divide-neutral-700">
                {order.products?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <img
                      src={item.product?.image || "https://placehold.co/80x80"}
                      alt={item.product?.name}
                      className="w-16 h-16 object-contain bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product?._id}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {item.product?.name || "Product"}
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-neutral-400 mt-0.5">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        ₹{(item.product?.price || 0) * item.quantity}
                      </p>
                      <p className="text-xs text-gray-400">
                        ₹{item.product?.price} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TrackOrder;
