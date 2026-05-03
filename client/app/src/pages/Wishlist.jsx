import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist, clearWishlist} from '../Store/wishlistSlice.js';
import { addToCart } from '../Store/cartSlice.js';
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [selectedItems, setSelectedItems] = useState([]);
  
  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
  };
  
  const handleMoveToCart = (item) => {
    dispatch(addToCart(item));
    dispatch(removeFromWishlist(item.id));
  };
  
  const handleMoveSelectedToCart = () => {
    selectedItems.forEach(itemId => {
      const item = wishlistItems.find(wishlistItem => wishlistItem.id === itemId);
      if (item) {
        dispatch(addToCart(item));
        dispatch(removeFromWishlist(itemId));
      }
    });
    setSelectedItems([]);
  };
  
  const handleRemoveSelected = () => {
    selectedItems.forEach(itemId => {
      dispatch(removeFromWishlist(itemId));
    });
    setSelectedItems([]);
  };
  
  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      dispatch(clearWishlist());
    }
  };
  
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Start adding items you love to your wishlist!</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {wishlistItems.length} items
            </span>
          </div>
          
          {wishlistItems.length > 0 && (
            <button
              onClick={handleClearWishlist}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          )}
        </div>
        
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <span className="text-blue-800">
              {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
            </span>
            <div className="space-x-2">
              <button
                onClick={handleMoveSelectedToCart}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaShoppingCart className="inline mr-2" />
                Move to Cart
              </button>
              <button
                onClick={handleRemoveSelected}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaTrash className="inline mr-2" />
                Remove Selected
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex items-center">
            <input
              type="checkbox"
              checked={selectedItems.length === wishlistItems.length}
              onChange={handleSelectAll}
              className="mr-3"
            />
            <span className="font-medium">Select All</span>
          </div>
          
          <div className="divide-y">
            {wishlistItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="mr-4"
                  />
                  
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg mr-4"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        ${item.price}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <FaShoppingCart className="inline mr-2" />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => dispatch(removeFromWishlist(item.id))}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
