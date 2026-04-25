import { createSlice } from '@reduxjs/toolkit';

// Load wishlist from localStorage
const loadWishlistFromStorage = () => {
  try {
    const serializedWishlist = localStorage.getItem('wishlist');
    if (serializedWishlist === null) {
      return [];
    }
    return JSON.parse(serializedWishlist);
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
    return [];
  }
};

// Save wishlist to localStorage
const saveWishlistToStorage = (wishlist) => {
  try {
    const serializedWishlist = JSON.stringify(wishlist);
    localStorage.setItem('wishlist', serializedWishlist);
  } catch (error) {
    console.error('Error saving wishlist to localStorage:', error);
  }
};

const initialState = {
  items: loadWishlistFromStorage(),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const existingItem = state.items.find(item => item._id === action.payload._id);
      if (!existingItem) {
        state.items.push({ ...action.payload, quantity: 1 });
        saveWishlistToStorage(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage(state.items);
    },
    setWishlist: (state, action) => {
      state.items = action.payload;
      saveWishlistToStorage(state.items);
    },
    moveWishlistToCart: (state, action) => {
      // This action doesn't modify state, it's handled by the component
      // The actual cart logic is handled in the Wishlist component
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlist, moveWishlistToCart } = wishlistSlice.actions;

export default wishlistSlice.reducer;
