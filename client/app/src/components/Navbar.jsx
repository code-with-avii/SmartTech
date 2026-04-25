import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LogoutUser from "./LogoutUser";
import { Logout } from "../Store/userSlice";
import { FaShoppingCart, FaUser, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const wishlistItemCount = wishlistItems.length;

  const handleLogout = async () => {
    await LogoutUser(); // Call backend logout
    dispatch(Logout()); // Clear Redux state
    navigate("/login"); // Navigate without full page reload if possible
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm">
      <div className="flex justify-between items-center px-6 py-3">
        <img src="\smart.png" alt="SmartTech Logo" className="h-14 md:h-12 bg-white px-2 rounded-lg shadow-md" />

        {/* Desktop Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-gray-200 shadow-sm">
          <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
          <input
            type="search"
            placeholder="Search products..."
            className="bg-transparent outline-none text-sm"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate('/cart')}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Cart"
              >
                <FaShoppingCart />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => navigate('/wishlist')}
                className="relative p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Wishlist"
              >
                <FaHeart />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => navigate('/profile')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="Profile"
              >
                <FaUser />
              </button>
              
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-md text-white 
                bg-linear-to-r from-red-500 to-rose-600 
                hover:scale-105 transition duration-300 shadow-md cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-md text-white 
              bg-linear-to-r from-green-500 to-emerald-600 
              hover:scale-105 transition duration-300 shadow-md"
            >
              Login
            </Link>
          )}
        </div>
      </div>

        {/* Mobile Menu Button */}
      <div className="md:hidden">
          <i
            className="fa-solid fa-bars text-2xl cursor-pointer"
            onClick={() => setOpen(!open)}
          ></i>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4 flex flex-col gap-4">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md 
          bg-white/50 backdrop-blur-md border border-gray-200"
          >
            <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
            <input
              type="search"
              placeholder="Search..."
              className="bg-transparent outline-none w-full"
            />
          </div>
          {isLoggedIn ? (
            <>
              <button
                onClick={handleLogout}
                className="text-center px-4 py-2 rounded-md text-white bg-linear-to-r from-red-500 to-rose-600 cursor-pointer"
              >
                Logout
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <FaUser /> Profile
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-md text-white bg-linear-to-r from-green-500 to-emerald-600 hover:scale-105 transition duration-300 shadow-md"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            <FaShoppingCart /> Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
