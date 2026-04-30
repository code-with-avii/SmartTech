import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { addToCart } from "../Store/cartSlice.js";
import { addToWishlist, removeFromWishlist } from "../Store/wishlistSlice.js";
import { CategoryPageSkeleton } from "./LoadingSkeleton";
import { Link } from 'react-router-dom';
import LazyImage from "./LazyImage";
import MobileFilterPanel from "./MobileFilterPanel";
import ToastNotification from "./ToastNotification";
import { FaHeart } from 'react-icons/fa';
import { API_URL } from "../Utils/config.js";

const ProductSection = ({ type, title }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', isVisible: false });

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        const filteredType = res.data.filter(
          (item) =>
            item.type && item.type.toLowerCase() === type.toLowerCase()
        );
        setProducts(filteredType);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type]);

  const filtered = useMemo(() => {
    let data = [...products];

    if (search) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (priceFilter === "low") data = data.filter((p) => p.price < 10000);
    if (priceFilter === "mid")
      data = data.filter((p) => p.price >= 10000 && p.price <= 30000);
    if (priceFilter === "high") data = data.filter((p) => p.price > 30000);

    if (brandFilter) {
      data = data.filter((p) =>
        p.name.toLowerCase().includes(brandFilter.toLowerCase())
      );
    }

    if (sort === "low-high") data.sort((a, b) => a.price - b.price);
    if (sort === "high-low") data.sort((a, b) => b.price - a.price);

    return data;
  }, [products, search, priceFilter, brandFilter, sort]);

  const handleAddtoCart = (item) => {
    // Immediate alert to test if function is called
    alert(`${item.name} added to cart!`);
    
    // Add to cart
    dispatch(addToCart(item));
    
    // Set toast state
    setToast({ message: `${item.name} added to cart!`, isVisible: true });
  };

  const handleAddToWishlist = (item) => {
    const isInWishlist = wishlistItems.some(wishlistItem => wishlistItem._id === item._id);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(item._id));
      alert(`${item.name} removed from wishlist!`);
    } else {
      dispatch(addToWishlist(item));
      alert(`${item.name} added to wishlist!`);
    }
  };

  const isInWishlist = (itemId) => {
    return wishlistItems.some(item => item._id === itemId);
  };

  const closeToast = () => {
    setToast({ message: '', isVisible: false });
  };

  if (loading) {
    return <CategoryPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title} Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our premium collection of {title.toLowerCase()} with cutting-edge technology, 
            exceptional performance, and unbeatable prices.
          </p>
          {/* Test Button for Debugging */}
          <button
            onClick={() => alert('Test alert is working!')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Alert
          </button>
        </div>
      
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Mobile Filter Button */}
          <div className="flex lg:hidden justify-between items-center mb-4">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
            </button>
            <div className="text-sm text-gray-600">
              {filtered.length} products
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    onChange={() => setPriceFilter("low")}
                    className="mr-2 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">Under 10,000</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    onChange={() => setPriceFilter("mid")}
                    className="mr-2 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">10,000 - 30,000</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    onChange={() => setPriceFilter("high")}
                    className="mr-2 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">Above 30,000</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setPriceFilter("");
                  setBrandFilter("");
                  setSearch("");
                  setSort("");
                }}
                className="w-full bg-linear-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              <Link to={`/product/${item._id}`} className="block">
                {/* Product Image */}
                <div className="relative overflow-hidden h-64 bg-linear-to-br from-gray-50 to-gray-100">
                  <LazyImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    HOT
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  
                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-bold text-gray-900">Rs.{item.price}</span>
                      <span className="text-gray-400 line-through text-sm">Rs.{item.price + 5000}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-gray-500 text-sm ml-2">(4.5)</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {type === 'mobile' ? 'Latest Technology' : 'High Performance'}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {type === 'mobile' ? 'Premium Quality' : 'Professional Grade'}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Buttons outside Link */}
              <div className="p-6 pt-0">
                <div className="flex gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddtoCart(item);
                    }}
                    className="flex-1 bg-linear-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Add to Cart
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(item);
                    }}
                    className={`p-3 border rounded-lg transition-colors duration-300 ${
                      isInWishlist(item._id)
                        ? 'bg-red-50 border-red-300 text-red-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                    title={isInWishlist(item._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <FaHeart className={`w-5 h-5 ${isInWishlist(item._id) ? 'text-red-600' : 'text-gray-600'}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {title.toLowerCase()} found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
      
      {/* Mobile Filter Panel */}
      <MobileFilterPanel
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        search={search}
        setSearch={setSearch}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        sort={sort}
        setSort={setSort}
        type={type}
        onClearFilters={() => {
          setPriceFilter("");
          setBrandFilter("");
          setSearch("");
          setSort("");
        }}
      />
      
      {/* Toast Notification */}
      <ToastNotification
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
};

export default ProductSection;