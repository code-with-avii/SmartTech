import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../Store/cartSlice.js";
import React from "react";
import { Link } from "react-router-dom";
import QuickView from "./QuickView";
import { API_URL } from "../Utils/config.js";
import { addToCompare, removeFromCompare } from "../Store/compareSlice.js";
import { FaBalanceScale } from "react-icons/fa";
import { useToast } from "../hooks/useToast.js";

const Contents = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const dispatch = useDispatch();
  const compareItems = useSelector((state) => state.compare?.items || []);
  const { showToast } = useToast();

  const isInCompare = (id) => compareItems.some((item) => item._id === id);

  const handleToggleCompare = (product) => {
    if (isInCompare(product._id)) {
      dispatch(removeFromCompare(product._id));
      showToast("Removed from comparison");
    } else {
      if (compareItems.length >= 3) {
        showToast("You can compare up to 3 products at a time.", "error");
        return;
      }
      dispatch(addToCompare(product));
      showToast("Added to comparison");
    }
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
    setIsQuickViewOpen(false);
  };

  const fetchProducts = async () => {
    axios
      .get(`${API_URL}/products?limit=8`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddtoCart = (product) => {
    let selectedVariant = null;
    if (product.variants && product.variants.length > 0) {
      selectedVariant = product.variants.find(v => (v.countInStock || 0) > 0) || product.variants[0];
    }
    dispatch(addToCart({ ...product, selectedVariant }));
    showToast(`${product.name} added to cart!`);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sort === "lowToHigh") return a.price - b.price;
    if (sort === "highToLow") return b.price - a.price;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Popular Products</h2>
          <p className="text-gray-500 text-sm mt-1">
            Discover our most trending tech items
          </p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 grow md:grow-0">
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-auto cursor-pointer"
            >
              <option value="">Recommended</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {sortedProducts.map((product) => {
          const isOutOfStock = product.variants && product.variants.length > 0
            ? product.variants.reduce((sum, v) => sum + (v.countInStock || 0), 0) === 0
            : false;

          return (
            <div
              key={product._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group relative"
            >
              <Link to={`/product/${product._id}`} className="block relative overflow-hidden h-48 bg-linear-to-br from-purple-50 to-pink-50">
                <img
                  src={product.image}
                  onError={(e) => {
                    e.target.src = "https://placehold.co/300x300";
                  }}
                  alt={product.name}
                  className={`w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? "grayscale opacity-50" : ""}`}
                />
                
                <div className="absolute top-3 right-3 flex flex-col gap-1">
                  {isOutOfStock ? (
                    <span className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm">
                      Out of stock
                    </span>
                  ) : (
                    <span className="bg-linear-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-sm">
                      20% OFF
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleCompare(product);
                  }}
                  className={`absolute top-3 left-3 p-2 rounded-full transition-all shadow-md z-10 ${
                    isInCompare(product._id)
                      ? "bg-green-500 text-white"
                      : "bg-white text-gray-600 hover:text-green-600"
                  }`}
                  title={isInCompare(product._id) ? "Remove from comparison" : "Add to comparison"}
                >
                  <FaBalanceScale className="text-xs" />
                </button>
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickView(product);
                    }}
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold transform scale-0 group-hover:scale-100 transition-all duration-300"
                  >
                    Quick View
                  </button>
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${product._id}`} className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors block">
                  {product.name}
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">(4.3)</span>
                </div>

                <div className="mb-4">
                  <span className="text-lg font-bold text-gray-900">Rs.{product.price}</span>
                </div>

                <button
                  onClick={() => handleAddtoCart(product)}
                  disabled={isOutOfStock}
                  className={`w-full py-2 px-4 rounded-lg transition-all duration-300 transform font-semibold text-sm cursor-pointer ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed scale-100"
                      : "bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:scale-105"
                  }`}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              </div>
            </div>
          );
        })}
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
