import axios from "axios";
import { API_URL } from "./config.js";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let refreshPromise = null;

const refreshSession = () => {
  refreshPromise ??= axios
    .post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || "";
    const isAuthRequest =
      requestUrl.includes("/api/auth/refresh") ||
      requestUrl.includes("/api/auth/login") ||
      requestUrl.includes("/api/auth/signup");

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
      } catch {
        localStorage.removeItem("user");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
