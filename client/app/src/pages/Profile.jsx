import React from "react";
import Navbar from "../components/Navbar";
import { FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import LogoutUser from "../components/LogoutUser.jsx";
import Logout  from "../Store/userSlice.js";
import { Link } from "react-router";
import Footer from "../components/Footer.jsx";
import VerificationStatus from "../components/VerificationStatus.jsx";

const Profile = () => {
  const { name, email, isVerified } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 flex gap-6 p-6">
        {/* Sidebar */}
        <div className="w-1/4 bg-white rounded-2xl shadow-sm p-5 h-fit">
          {/* User Info */}
          <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <div className="w-14 h-14 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow">
              {name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm text-gray-500">Hello,</p>
              <h2 className="font-semibold text-gray-800">{name}</h2>
            </div>
          </div>

          {/* Menu */}
          <div className="space-y-5 text-sm">
            <Link
              to="/cart"
              className="block font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              🛒 My Orders
            </Link>

            <div>
              <p className="font-semibold text-gray-700 mb-2">
                Account Settings
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="bg-blue-50 text-blue-600 p-2 rounded-lg font-medium">
                  Profile Information
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  Manage Addresses
                </li>
                <li className="hover:text-blue-600 cursor-pointer">
                  PAN Card Information
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-2">Payments</p>
              <ul className="space-y-2 text-gray-600">
                <li>Gift Cards</li>
                <li>Saved UPI</li>
                <li>Saved Cards</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-gray-700 mb-2">My Stuff</p>
              <ul className="space-y-2 text-gray-600">
                <li>My Coupons</li>
                <li>My Reviews & Ratings</li>
                <li>All Notifications</li>
                <li>My Wishlist</li>
              </ul>
            </div>

            {/* Logout */}
            <div className="flex items-center gap-3 pt-4 border-t cursor-pointer text-red-500 hover:text-red-600">
              <FaSignOutAlt />
              <button
                onClick={async () => {
                  alert("logged out");
                  await LogoutUser();
                  dispatch(Logout());
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        

        {/* Main Content */}
        <div className="w-3/4 space-y-6">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h2>
              <button className="text-blue-600 hover:underline text-sm">
                Edit
              </button>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={name}
                className="border p-3 w-1/2 rounded-lg bg-gray-50"
                readOnly
              />
              <input
                type="text"
                value={name}
                className="border p-3 w-1/2 rounded-lg bg-gray-50"
                readOnly
              />
            </div>

            <div className="mt-5">
              <p className="mb-2 text-gray-600">Your Gender</p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" />
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="gender" />
                  Female
                </label>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Email Address
              </h2>
              <button className="text-blue-600 text-sm hover:underline">
                Edit
              </button>
            </div>

            <input
              type="text"
              value={email}
              className="border p-3 w-1/2 mt-4 rounded-lg bg-gray-50"
              readOnly
            />

            <div className="mt-3">
              <VerificationStatus isVerified={isVerified} email={email} />
            </div>
          </div>

          {/* Mobile */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Mobile Number
              </h2>
              <button className="text-blue-600 text-sm hover:underline">
                Edit
              </button>
            </div>

            <input
              type="text"
              placeholder="Enter your number"
              className="border p-3 w-1/2 mt-4 rounded-lg bg-gray-50"
              readOnly
            />
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">FAQs</h2>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">
                  What happens when I update my email address?
                </p>
                <p className="text-gray-600 mt-1">
                  Your login email changes and all communication goes to the new
                  one.
                </p>
              </div>

              <div>
                <p className="font-medium">When will my account be updated?</p>
                <p className="text-gray-600 mt-1">
                  It updates immediately after OTP confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
