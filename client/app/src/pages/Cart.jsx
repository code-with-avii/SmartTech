import React from "react";
import TopNavbar from "../components/TopNavbar.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer.jsx";
import { useSelector, useDispatch } from "react-redux";
import {increaseQuantity,decreaseQuantity,removeFromCart,clearCart,} from "../Store/cartSlice";
import {FaTrash, FaPlus,FaMinus,FaArrowRight,FaShoppingBag,} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (acc, item) => {
      const quantity = item.quantity || 1;
      return acc + (item.price * quantity);
    },
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <TopNavbar />
      <Navbar />

      <main className="grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <FaShoppingBag className="text-indigo-600" />
            Your Shopping Cart
          </h1>
          <span className="text-gray-500 font-medium">
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center transform transition-all hover:scale-[1.01] duration-300">
            <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <FaShoppingBag className="text-indigo-300 text-5xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-md">
              Looks like you haven't added anything to your cart yet. Explore
              our top categories and find something you'll love!
            </p>
            <Link
              to="/"
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="lg:w-2/3 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-5 transition-all hover:shadow-md hover:border-indigo-100 group"
                >
                  <div className="relative overflow-hidden rounded-xl bg-gray-100 w-full sm:w-28 h-28 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="grow flex flex-col sm:flex-row justify-between w-full h-full">
                    <div className="flex flex-col justify-center mb-4 sm:mb-0">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-indigo-600 font-semibold mt-1">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 h-full mt-auto">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
                        <button
                          onClick={() => dispatch(decreaseQuantity(item.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all active:scale-90"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(increaseQuantity(item.id))}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm transition-all active:scale-90"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="font-bold text-gray-900 text-lg hidden sm:block">
                          ₹
                          {(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                        <button
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 flex items-center gap-1 text-sm font-medium"
                        >
                          <FaTrash className="sm:hidden" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center mt-6 pt-4">
                <Link
                  to="/"
                  className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors flex items-center gap-2"
                >
                  &larr; Continue Shopping
                </Link>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-red-500 font-medium hover:text-red-700 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 text-gray-600 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Estimate</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax Estimate</span>
                    <span className="text-gray-900 font-bold">
                      ₹{(total * 0.18).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-extrabold text-indigo-600">
                        ₹{(total + total * 0.18).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Including GST</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (items.length === 0) {
                      alert('Your cart is empty. Please add items before proceeding to checkout.');
                      return;
                    }
                    navigate("/razorpay-payment");
                  }}
                  className="w-full mt-8 bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transform transition-all duration-300 active:scale-[0.98]"
                >
                  Proceed to Checkout
                  <FaArrowRight className="text-sm" />
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 bg-gray-50 py-3 rounded-lg border border-gray-100">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Secure SSL Checkout
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
