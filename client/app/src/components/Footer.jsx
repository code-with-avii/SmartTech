import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa"
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 mt-16 relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">ST</span>
              </div>
              <h2 className="text-3xl font-bold text-white">SmartTech</h2>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted destination for cutting-edge electronics and gadgets. 
              Discover innovation, quality, and exceptional service.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <FaPhone className="text-blue-400" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <FaEnvelope className="text-blue-400" />
                <span className="text-sm">support@smarttech.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors">
                <FaMapMarkerAlt className="text-blue-400" />
                <span className="text-sm">Mumbai, India</span>
              </div>
            </div>
          </div>

          {/* Shop Categories */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Shop Categories</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/mobiles" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Mobile Phones
                </Link>
              </li>
              <li>
                <Link to="/laptops" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/tablets" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Tablets
                </Link>
              </li>
              <li>
                <Link to="/drones" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Drones
                </Link>
              </li>
              <li>
                <Link to="/cameras" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Cameras
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Gaming
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <FaArrowRight className="w-0 h-0 mr-0 group-hover:w-4 group-hover:h-4 group-hover:mr-2 transition-all duration-300" />
                  Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Stay Updated</h3>
            <p className="text-gray-400 leading-relaxed">
              Subscribe to our newsletter for exclusive deals, new product launches, and tech insights.
            </p>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2">
                  <span>Join</span>
                  <FaArrowRight className="text-sm" />
                </button>
              </div>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300 cursor-pointer">
                  <FaFacebook className="text-white" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-pink-600 transition-colors duration-300 cursor-pointer">
                  <FaInstagram className="text-white" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors duration-300 cursor-pointer">
                  <FaTwitter className="text-white" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-300 cursor-pointer">
                  <FaYoutube className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              {new Date().getFullYear()} SmartTech. All rights reserved. Made with <span className="text-red-500">love</span> in India.
            </p>
            
            <div className="flex space-x-6 text-sm">
              <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Privacy Policy</Link>
              <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Terms of Service</Link>
              <Link to="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer