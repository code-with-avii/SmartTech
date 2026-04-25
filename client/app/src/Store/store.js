import { configureStore,combineReducers } from '@reduxjs/toolkit';
import cartReducer from './cartSlice.js';
import userReducer from "./userSlice.js";
import wishlistReducer from './wishlistSlice.js';
import {persistStore,persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";

const appReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "user/Logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "cart", "wishlist"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER', 'persist/FLUSH', 'persist/PAUSE', 'persist/PURGE'],
      },
    }),
});

export const persistor = persistStore(store);
