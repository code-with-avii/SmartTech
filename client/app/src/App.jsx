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
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./Store/userSlice";
import AdminDashboard from "./pages/AdminDashboard.jsx"
import ProductDetail from "./pages/ProductDetail.jsx"
import Wishlist from "./pages/Wishlist.jsx"
import RazorpayPayment from "./pages/RazorpayPayment.jsx";
import GoogleCallback from "./pages/GoogleCallback.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token && user) {
      dispatch(login(JSON.parse(user)));
    }
  }, [dispatch]);

  return (
    
    <Router>
      {/* <Home/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/google-callback" element={<GoogleCallback />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/help" element={<Helpcenter />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element= {<Profile/>}/>
        <Route path="/mobiles" element={<Mobilesection/>}/>
        <Route path="/laptops" element={<Laptopsection/>}/>
        <Route path="/drones" element={<DroneSection/>}/>
        <Route path="/cameras" element={<CameraSection/>}/>
        <Route path="/tablets" element={<TabletSection/>}/>
        <Route path="/verify-email" element={<VerifyEmail/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path = "/admin" element={<AdminDashboard/>}/>
        <Route path="/product/:id" element={<ProductDetail/>}/>
        <Route path="/razorpay-payment" element={<RazorpayPayment />} />
      </Routes>
    </Router>
  );
}

export default App;

