import React from "react";

const Banner = () => {
  return (
    <div
    style={{
        background: "linear-gradient(270deg, #7c3aed, #ec4899, #ef4444)",
        backgroundSize: "600% 600%",
        animation: "gradientMove 6s ease infinite",
      }}
       className="relative overflow-hidden bg-linear-to-r from-purple-600 via-pink-500 to-red-500 animate-gradient-x text-white">
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left Side */}
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Mega Sale 🔥
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Up to <span className="font-bold">20% OFF</span> on all products
          </p>

          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
            Shop Now
          </button>
        </div>

        {/* Right Side (optional image placeholder) */}
        <div className="mt-8 md:mt-0">
          <img
            src="https://via.placeholder.com/300"
            alt="sale"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 blur-3xl"></div>
    </div>
  );
};

export default Banner;