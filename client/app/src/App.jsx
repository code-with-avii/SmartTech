import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx"
import Helpcenter from "./pages/Helpcenter.jsx";
import Cart from "./pages/Cart.jsx";
import SignUp from "./pages/signup.jsx";
import Profile from "./pages/Profile.jsx";
import MobileSection from "./Products/MobileSec";
import LaptopSection from "./Products/LaptopSec";
import DroneSection from "./Products/DroneSection.jsx";
import TabletSection from "./Products/TabletSection.jsx";
import CameraSection from "./Products/CameraSection.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login, Logout } from "./Store/userSlice";
import AdminDashboard from "./pages/AdminDashboard.jsx"
import ProductDetail from "./pages/ProductDetail.jsx"
import Wishlist from "./pages/Wishlist.jsx"
import RazorpayPayment from "./pages/RazorpayPayment.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";
import Orders from "./pages/Orders.jsx";
import SearchResults from "./pages/SearchResults.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import Compare from "./pages/Compare.jsx";
import TopNavbar from "./components/TopNavbar.jsx";
import api from "./Utils/api.js";

function App() {
  const dispatch = useDispatch();
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        const res = await api.post("/api/auth/refresh");
        if (res.data && res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          dispatch(login(res.data.user));
        } else {
          localStorage.removeItem("user");
          dispatch(Logout());
        }
      } catch (err) {
        localStorage.removeItem("user");
        dispatch(Logout());
      } finally {
        setSessionReady(true);
      }
    };
    checkAuthSession();
  }, [dispatch]);

  if (!sessionReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <TopNavbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/help" element={<Helpcenter />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/mobiles" element={<MobileSection/>}/>
        <Route path="/laptops" element={<LaptopSection/>}/>
        <Route path="/drones" element={<DroneSection/>}/>
        <Route path="/cameras" element={<CameraSection/>}/>
        <Route path="/tablets" element={<TabletSection/>}/>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/admin" element={<AdminRoute><AdminDashboard/></AdminRoute>}/>
        <Route path="/product/:id" element={<ProductDetail/>}/>
        <Route path="/razorpay-payment" element={<ProtectedRoute><RazorpayPayment /></ProtectedRoute>} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </Router>
  );
}

export default App;
