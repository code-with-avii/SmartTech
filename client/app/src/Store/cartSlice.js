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
      const variant = newItem.selectedVariant || null;
      const variantKey = variant ? `-${variant.color || ""}-${variant.size || ""}` : "";
      const cartItemId = `${newItem._id}${variantKey}`;

      const existingItem = state.items.find((item) => item.id === cartItemId);
      const qtyToAdd = newItem.quantity || 1;

      if (!existingItem) {
        state.items.push({
          id: cartItemId,
          productId: newItem._id,
          name: newItem.name,
          price: newItem.price,
          quantity: qtyToAdd,
          image: newItem.image,
          selectedVariant: variant,
        });
      } else {
        existingItem.quantity += qtyToAdd;
      }

      state.totalAmount += newItem.price * qtyToAdd;
      saveCartToStorage(state.items, state.totalAmount);
    },
    removeFromCart(state, action) {
      const cartItemId = action.payload;
      const removedItem = state.items.find((item) => item.id === cartItemId);
      state.items = state.items.filter((item) => item.id !== cartItemId);
      if (removedItem) {
        state.totalAmount -= removedItem.price * removedItem.quantity;
      }
      saveCartToStorage(state.items, state.totalAmount);
    },
    increaseQuantity(state, action) {
      const cartItemId = action.payload;
      const item = state.items.find((item) => item.id === cartItemId);
      if (item) {
        item.quantity++;
        state.totalAmount += item.price;
        saveCartToStorage(state.items, state.totalAmount);
      }
    },
    decreaseQuantity(state, action) {
      const cartItemId = action.payload;
      const item = state.items.find((item) => item.id === cartItemId);
      if (item) {
        if (item.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== cartItemId);
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
