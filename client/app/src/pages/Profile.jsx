import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FaSignOutAlt, FaPlus, FaEdit, FaTrash, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import LogoutUser from "../components/LogoutUser.jsx";
import { Logout } from "../Store/userSlice.js";
import { Link } from "react-router";
import Footer from "../components/Footer.jsx";
import VerificationStatus from "../components/VerificationStatus.jsx";
import { useToast } from "../hooks/useToast.js";
import { useNavigate } from "react-router-dom";
import api from "../Utils/api.js";

const EMPTY_ADDR = { fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pinCode: '' };

const Profile = () => {
  const { name, email, isVerified } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses'
  const [addresses, setAddresses] = useState([]);
  const [loadingAddr, setLoadingAddr] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null); // null = add new, object = editing
  const [addrForm, setAddrForm] = useState(EMPTY_ADDR);
  const [savingAddr, setSavingAddr] = useState(false);

  const fetchAddresses = async () => {
    setLoadingAddr(true);
    try {
      const res = await api.get("/api/auth/addresses");
      setAddresses(res.data || []);
    } catch (e) {
      showToast("Failed to load addresses", "error");
    } finally {
      setLoadingAddr(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'addresses') fetchAddresses();
  }, [activeTab]);

  const handleAddrFormChange = (e) => {
    setAddrForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openAddNew = () => {
    setEditingAddr(null);
    setAddrForm(EMPTY_ADDR);
    setShowAddrForm(true);
  };

  const openEdit = (addr) => {
    setEditingAddr(addr._id || addr.id);
    setAddrForm({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      addressLine1: addr.addressLine1 || '',
      addressLine2: addr.addressLine2 || '',
      city: addr.city || '',
      state: addr.state || '',
      pinCode: addr.pinCode || '',
    });
    setShowAddrForm(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!addrForm.fullName || !addrForm.addressLine1 || !addrForm.city || !addrForm.state || !addrForm.pinCode) {
      showToast("Please fill all required fields", "error");
      return;
    }
    setSavingAddr(true);
    try {
      if (editingAddr) {
        await api.put(`/api/auth/addresses/${editingAddr}`, addrForm);
        showToast("Address updated!");
      } else {
        await api.post("/api/auth/addresses", addrForm);
        showToast("Address added!");
      }
      setShowAddrForm(false);
      fetchAddresses();
    } catch {
      showToast("Failed to save address", "error");
    } finally {
      setSavingAddr(false);
    }
  };

  const handleDeleteAddress = async (addrId) => {
    if (!window.confirm("Remove this address?")) return;
    try {
      await api.delete(`/api/auth/addresses/${addrId}`);
      showToast("Address removed");
      fetchAddresses();
    } catch {
      showToast("Failed to delete address", "error");
    }
  };

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
              to="/orders"
              className="block font-semibold text-gray-700 hover:text-blue-600 transition"
            >
              🛒 My Orders
            </Link>

            <div>
              <p className="font-semibold text-gray-700 mb-2">Account Settings</p>
              <ul className="space-y-2 text-gray-600">
                <li
                  onClick={() => setActiveTab('profile')}
                  className={`cursor-pointer p-2 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:text-blue-600'}`}
                >
                  Profile Information
                </li>
                <li
                  onClick={() => setActiveTab('addresses')}
                  className={`cursor-pointer p-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'addresses' ? 'bg-blue-50 text-blue-600' : 'hover:text-blue-600'}`}
                >
                  <FaMapMarkerAlt className="text-xs" /> Manage Addresses
                </li>
                <li className="hover:text-blue-600 cursor-pointer p-2">PAN Card Information</li>
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
                <li><Link to="/orders" className="hover:text-blue-600">My Orders</Link></li>
                <li>My Coupons</li>
                <li>My Reviews &amp; Ratings</li>
                <li>All Notifications</li>
                <li>My Wishlist</li>
              </ul>
            </div>

            {/* Logout */}
            <div className="flex items-center gap-3 pt-4 border-t cursor-pointer text-red-500 hover:text-red-600">
              <FaSignOutAlt />
              <button
                onClick={async () => {
                  await LogoutUser();
                  dispatch(Logout());
                  showToast("Logged out successfully");
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        

        {/* Main Content */}
        <div className="w-3/4 space-y-6">

          {/* ─── PROFILE TAB ─── */}
          {activeTab === 'profile' && (
            <>
              {/* Personal Info */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
                  <button className="text-blue-600 hover:underline text-sm">Edit</button>
                </div>

                <div className="flex gap-4">
                  <input type="text" value={name} className="border p-3 w-1/2 rounded-lg bg-gray-50" readOnly />
                  <input type="text" value={name} className="border p-3 w-1/2 rounded-lg bg-gray-50" readOnly />
                </div>

                <div className="mt-5">
                  <p className="mb-2 text-gray-600">Your Gender</p>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2"><input type="radio" name="gender" /> Male</label>
                    <label className="flex items-center gap-2"><input type="radio" name="gender" /> Female</label>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Email Address</h2>
                  <button className="text-blue-600 text-sm hover:underline">Edit</button>
                </div>
                <input type="text" value={email} className="border p-3 w-1/2 mt-4 rounded-lg bg-gray-50" readOnly />
                <div className="mt-3"><VerificationStatus isVerified={isVerified} email={email} /></div>
              </div>

              {/* Mobile */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Mobile Number</h2>
                  <button className="text-blue-600 text-sm hover:underline">Edit</button>
                </div>
                <input type="text" placeholder="Enter your number" className="border p-3 w-1/2 mt-4 rounded-lg bg-gray-50" readOnly />
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">FAQs</h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium">What happens when I update my email address?</p>
                    <p className="text-gray-600 mt-1">Your login email changes and all communication goes to the new one.</p>
                  </div>
                  <div>
                    <p className="font-medium">When will my account be updated?</p>
                    <p className="text-gray-600 mt-1">It updates immediately after OTP confirmation.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ─── ADDRESSES TAB ─── */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" /> Manage Addresses
                </h2>
                <button
                  onClick={openAddNew}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="text-xs" /> Add New Address
                </button>
              </div>

              {/* Address Form Modal */}
              {showAddrForm && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative">
                    <button
                      onClick={() => setShowAddrForm(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes />
                    </button>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {editingAddr ? 'Edit Address' : 'Add New Address'}
                    </h3>
                    <form onSubmit={handleSaveAddress} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name *</label>
                          <input name="fullName" value={addrForm.fullName} onChange={handleAddrFormChange}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Phone</label>
                          <input name="phone" value={addrForm.phone} onChange={handleAddrFormChange}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Address Line 1 *</label>
                        <input name="addressLine1" value={addrForm.addressLine1} onChange={handleAddrFormChange}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Address Line 2 (Landmark, etc.)</label>
                        <input name="addressLine2" value={addrForm.addressLine2} onChange={handleAddrFormChange}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">City *</label>
                          <input name="city" value={addrForm.city} onChange={handleAddrFormChange}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">State *</label>
                          <input name="state" value={addrForm.state} onChange={handleAddrFormChange}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Pin Code *</label>
                          <input name="pinCode" value={addrForm.pinCode} onChange={handleAddrFormChange}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" required />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={savingAddr}
                          className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60">
                          {savingAddr ? 'Saving...' : (editingAddr ? 'Update Address' : 'Save Address')}
                        </button>
                        <button type="button" onClick={() => setShowAddrForm(false)}
                          className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Addresses List */}
              {loadingAddr ? (
                <div className="text-center py-12 text-gray-400">Loading your addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaMapMarkerAlt className="text-blue-300 text-3xl" />
                  </div>
                  <h3 className="text-gray-700 font-semibold mb-2">No addresses saved yet</h3>
                  <p className="text-gray-400 text-sm mb-4">Add a shipping address to speed up checkout.</p>
                  <button onClick={openAddNew} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const addrId = addr._id || addr.id;
                    return (
                      <div key={addrId} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors relative">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-gray-900">{addr.fullName}</p>
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(addr)} className="text-blue-500 hover:text-blue-700 transition-colors p-1">
                              <FaEdit className="text-sm" />
                            </button>
                            <button onClick={() => handleDeleteAddress(addrId)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                              <FaTrash className="text-sm" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-sm text-gray-600">{addr.addressLine2}</p>}
                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} — {addr.pinCode}</p>
                        {addr.phone && <p className="text-xs text-gray-500 mt-1">📞 {addr.phone}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
