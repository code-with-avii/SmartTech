import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../Store/userSlice";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const userStr = params.get("user");

    if (accessToken && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Save to localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Dispatch to Redux
        dispatch(login(user));
        
        // Redirect to Home or Admin based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error parsing user data from Google Callback", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-blue-900 via-purple-900 to-black">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold">Authenticating...</h2>
        <p className="mt-2">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
