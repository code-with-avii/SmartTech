import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../Store/userSlice";
import { API_URL } from "../Utils/config.js";
import {FcGoogle} from "react-icons/fc";
import { useToast } from "../hooks/useToast.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true },
      );

      const userPayload = {
        email: res.data.user.email,
        name: res.data.user.name,
        role: res.data.user.role,
      };

      localStorage.setItem("accessToken", res.data.accessToken);
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(userPayload));

      dispatch(login(userPayload));

      showToast("Login successful");
      if (userPayload.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed", "error");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
    bg-linear-to-r from-blue-900 via-purple-900 to-black animate-gradient"
    >
      {/* Glass Card */}
      <div
        className="bg-white/10 backdrop-blur-lg border border-white/20 
      shadow-2xl rounded-2xl p-8 w-87.5 text-white 
      transform hover:-translate-y-2 transition duration-300"
      >
        <h2 className="text-center text-3xl mb-6 font-bold">Login</h2>

        <form onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-white/20 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-400 
              placeholder-gray-300"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white/20 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-purple-400 
              placeholder-gray-300"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-2 mt-2 rounded-md 
            bg-linear-to-r from-blue-500 to-purple-500 
            hover:scale-105 hover:shadow-lg 
            transition duration-300 font-semibold"
          >
            Login
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-blue-300 hover:text-blue-400 transition duration-200 text-sm"
          >
            Forgot your password?
          </button>
        </div>

        {/* Signup Button */}
        <button
          onClick={() => navigate("/signup")}
          className="w-full mt-4 py-2 rounded-md 
          bg-linear-to-r from-purple-500 to-pink-500 
          hover:scale-105 hover:shadow-lg 
          transition duration-300"
        >
          Sign Up
        </button>
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-white/20"></div>

          <span className="px-3 text-sm text-gray-300">OR</span>

          <div className="flex-1 h-px bg-white/20"></div>
        </div>
        <button
          onClick={() => {
            window.location.href = `${API_URL}/api/auth/google`;
          }}
          className="
    w-full mt-4 flex items-center justify-center gap-3
    bg-white/10 backdrop-blur-md
    border border-white/20
    text-white font-medium
    py-3 rounded-xl
    hover:bg-white/20
    hover:shadow-xl
    hover:-translate-y-1
    transition-all duration-300
  "
        >
          <FcGoogle className="text-2xl bg-white rounded-full p-1" />

          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
