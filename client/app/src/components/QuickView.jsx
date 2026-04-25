import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../Store/cartSlice.js';
import { addToWishlist, removeFromWishlist } from '../Store/wishlistSlice.js';
import { FaHeart, FaShoppingCart, FaTimes, FaStar } from 'react-icons/fa';

const QuickView = ({ product, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      _id: product._id,
      quantity: quantity
    };
    dispatch(addToCart(productToAdd));
    alert(`${product.name} added to cart!`);
    onClose();
  };

  const handleWishlist = () => {
    const isInWishlist = wishlistItems.some(item => item._id === product._id);
    
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      alert(`${product.name} removed from wishlist!`);
    } else {
      dispatch(addToWishlist(product));
      alert(`${product.name} added to wishlist!`);
    }
  };

  const isInWishlist = wishlistItems.some(item => item._id === product._id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Quick View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-w-full max-h-96 object-contain"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4" />
                  ))}
                </div>
                <span className="text-gray-500">(4.5)</span>
                <span className="text-gray-400">|</span>
                <span className="text-green-600 font-semibold">In Stock</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-bold text-gray-900">Rs.{product.price}</span>
                <span className="text-xl text-gray-400 line-through">Rs.{product.price + 5000}</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-semibold">
                  20% OFF
                </span>
              </div>
              <p className="text-green-600 font-medium">You save Rs.{product.price * 0.2}</p>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">
                Experience premium quality with this amazing product. Features cutting-edge technology 
                and exceptional performance for all your needs.
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Quantity</h4>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border border-gray-300 rounded-lg py-2"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                <FaShoppingCart className="inline mr-2" />
                Add to Cart
              </button>
              
              <button
                onClick={handleWishlist}
                className={`w-full py-3 px-6 rounded-lg border-2 transition-all duration-300 font-semibold ${
                  isInWishlist
                    ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FaHeart className={`inline mr-2 ${isInWishlist ? 'text-red-600' : ''}`} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Free Shipping
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                1 Year Warranty
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Easy Returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
