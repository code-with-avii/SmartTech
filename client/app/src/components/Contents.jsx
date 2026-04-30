import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../Store/cartSlice.js";
import React from "react";
import QuickView from "./QuickView";
import { API_URL } from "../Utils/config.js";

const Contents = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const dispatch = useDispatch();

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
    setIsQuickViewOpen(false);
  };

  const fetchProducts = () => {
    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddtoCart = (product) => {
    dispatch(addToCart(product));
  };

  // 🔥 Sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            All Products Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our complete range of electronics and gadgets. From smartphones to drones, 
            find everything you need in one place.
          </p>
        </div>

        {/* Sort Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">Sort by:</span>
              <select
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Featured</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="text-sm">Showing {sortedProducts.length} products</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-48 bg-gradient-to-br from-purple-50 to-pink-50">
                <img
                  src={product.image}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/300x300";
                  }}
                  alt={product.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  20% OFF
                </div>
                
                {/* Quick View */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={() => handleQuickView(product)}
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform scale-0 group-hover:scale-100 transition-all duration-300"
                  >
                    Quick View
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Name */}
                <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">(4.3)</span>
                  <span className="text-xs text-gray-400">(1,245)</span>
                </div>

                {/* Price Section */}
                <div className="mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg font-bold text-gray-900">Rs.{product.price}</span>
                    <span className="text-gray-400 line-through text-sm">Rs.{product.price + 1500}</span>
                  </div>
                  <span className="text-green-600 text-xs font-semibold">Save Rs.{1500}</span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => handleAddtoCart(product)}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 font-semibold text-sm"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Check back later for new products</p>
          </div>
        )}
      </div>
      
      {/* QuickView Modal */}
      <QuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
    </div>
  );
};

export default Contents;
