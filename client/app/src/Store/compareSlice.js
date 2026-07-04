import { createSlice } from "@reduxjs/toolkit";

const compareSlice = createSlice({
  name: "compare",
  initialState: {
    items: [],
  },
  reducers: {
    addToCompare: (state, action) => {
      const exists = state.items.find((item) => item._id === action.payload._id);
      if (exists) return;

      if (state.items.length < 3) {
        state.items.push(action.payload);
      }
    },
    removeFromCompare: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },
    clearCompare: (state) => {
      state.items = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
