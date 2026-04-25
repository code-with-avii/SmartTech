import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setname] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const handlesignup = async (e) => {
    e.preventDefault(); // prevent reload

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/signup",
        {
          email,
          password,
          name,
        },
        { withCredentials: true },
      );

      console.log(res.data);
      setMessage(res.data.message || "Account created successfully! Please check your email to verify your account.");
      setMessageType("success");
      
      // Clear form
      setEmail("");
      setPassword("");
      setname("");
      
      // Navigate after showing message
      setTimeout(() => {
        navigate("/Login");
      }, 3000);
    } catch (err) {
      console.log(err.response?.data);
      alert("Signup Failed");
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
        <h2 className="text-center text-3xl mb-6 font-bold">Sign Up</h2>

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-md text-center ${
            messageType === "success" 
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handlesignup}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white/20 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-blue-400 
              placeholder-gray-300"
              value={name}
              onChange={(e) => setname(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-white/20 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-purple-400 
              placeholder-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-white/20 rounded-md 
              focus:outline-none focus:ring-2 focus:ring-pink-400 
              placeholder-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 mt-2 rounded-md 
            bg-linear-to-r from-blue-500 to-purple-500 
            hover:scale-105 hover:shadow-lg 
            transition duration-300 font-semibold"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <Link
          to="/login"
          className="block text-center mt-4 py-2 rounded-md 
          bg-linear-to-r from-purple-500 to-pink-500 
          hover:scale-105 hover:shadow-lg 
          transition duration-300"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
