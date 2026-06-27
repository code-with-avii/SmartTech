import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import LogoutUser from "../components/LogoutUser.jsx";
import { Logout } from "../Store/userSlice.js";
import { FaShoppingCart, FaUser, FaHeart, FaBox } from 'react-icons/fa';
import { useToast } from "../hooks/useToast.js";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
  const wishlistItemCount = wishlistItems.length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setOpen(false);
  };

  const handleLogout = async () => {
    await LogoutUser();
    dispatch(Logout());
    showToast("Logged out successfully");
    navigate("/login");
  };

  const searchInput = (
    <form onSubmit={handleSearch} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-gray-200 shadow-sm">
      <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
        className="bg-transparent outline-none text-sm w-full md:w-48"
      />
    </form>
  );

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm">
      <div className="flex justify-between items-center px-6 py-3">
        <Link to="/">
          <img src="\smart.png" alt="SmartTech Logo" className="h-14 md:h-12 bg-white px-2 rounded-lg shadow-md" />
        </Link>

        <div className="hidden md:block">{searchInput}</div>

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
                onClick={() => navigate('/orders')}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                title="My Orders"
              >
                <FaBox />
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

        <div className="md:hidden">
          <i
            className="fa-solid fa-bars text-2xl cursor-pointer"
            onClick={() => setOpen(!open)}
          ></i>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-4 flex flex-col gap-4">
          {searchInput}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => { navigate('/orders'); setOpen(false); }}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <FaBox /> My Orders
              </button>
              <button
                onClick={() => { navigate('/profile'); setOpen(false); }}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <FaUser /> Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-center px-4 py-2 rounded-md text-white bg-linear-to-r from-red-500 to-rose-600 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 rounded-md text-white bg-linear-to-r from-green-500 to-emerald-600 hover:scale-105 transition duration-300 shadow-md text-center"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => { navigate('/cart'); setOpen(false); }}
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
