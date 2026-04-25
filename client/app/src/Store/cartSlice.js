import { createSlice } from "@reduxjs/toolkit";

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
  }
  return { items: [], totalAmount: 0 };
};

// Save cart to localStorage
const saveCartToStorage = (items, totalAmount) => {
  try {
    localStorage.setItem('cart', JSON.stringify({ items, totalAmount }));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem._id);
      if (!existingItem) {
        state.items.push({
          id: newItem._id,
          name: newItem.name,
          price: newItem.price,
          quantity: 1,
          image: newItem.image,
        });
      } else {
        existingItem.quantity++;
      }

      state.totalAmount += newItem.price;
      saveCartToStorage(state.items, state.totalAmount);
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const removedItem = state.items.find((item) => item.id === id);
      state.items = state.items.filter((item) => item.id !== id);
      if (removedItem) {
        state.totalAmount -= removedItem.price * removedItem.quantity;
      }
      saveCartToStorage(state.items, state.totalAmount);
    },
    increaseQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity++;
        state.totalAmount += item.price;
        saveCartToStorage(state.items, state.totalAmount);
      }
    },
    decreaseQuantity(state, action) {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
          state.totalAmount -= item.price;
        } else {
          item.quantity--;
          state.totalAmount -= item.price;
        }
        saveCartToStorage(state.items, state.totalAmount);
      }
    },
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      saveCartToStorage(state.items, state.totalAmount);
    },
  },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
