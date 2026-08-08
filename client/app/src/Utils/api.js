import axios from "axios";
import { API_URL } from "./config.js";
import { store } from "../Store/store.js";
import { Logout } from "../Store/userSlice.js";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let refreshPromise = null;

const refreshSession = () => {
  refreshPromise ??= api.post("/api/auth/refresh").finally(() => {
    refreshPromise = null;
  });

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";

    const isAuthRequest = [
      "/api/auth/login",
      "/api/auth/signup",
      "/api/auth/refresh",
    ].some((path) => requestUrl.includes(path));

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;
      try {
        await refreshSession();
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("user");
        store.dispatch(Logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
