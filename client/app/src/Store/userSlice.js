import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  role: "user",
  isLoggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role || "user";
      state.isLoggedIn = true;
    },
    Logout: (state) => {
      state.name = "";
      state.email = "";
      state.role = "user";
      state.isLoggedIn = false;
    },
    updatedProfile: (state, action) => {
      state.name = action.payload.name || state.name;
    },
  },
});

export const { login, Logout, updatedProfile } = userSlice.actions;

export default userSlice.reducer;
