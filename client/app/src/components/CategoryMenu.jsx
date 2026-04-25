import { Link } from "react-router-dom";
import { useState } from 'react';

const CategoryMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const categories = [
    { name: 'Mobiles', to: '/mobiles', icon: '📱' },
    { name: 'Laptops', to: '/laptops', icon: '💻' },
    { name: 'Drones', to: '/drones', icon: '🚁' },
    { name: 'Cameras', to: '/cameras', icon: '📸' },
    { name: 'Tablets', to: '/tablets', icon: '📱' },
    { name: 'Audio', to: '/audio', icon: '🎧' },
    { name: 'TV & Home Cinemas', to: '/tv-home-cinemas', icon: '📺' },
    { name: 'Watches', to: '/watches', icon: '⌚' },
    { name: 'Gaming', to: '/gaming', icon: '🎮' },
    { name: 'Sale', to: '/sale', icon: '🏷️' },
    { name: 'More', to: '/more', icon: '⋯' }
  ];

  return (
    <div className="relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden p-2 text-gray-600 hover:text-gray-900"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 6h16M4 6v16M4 6h16" />
        </svg>
      </button>

      {/* Desktop Category Menu */}
      <nav className="hidden md:flex items-center h-full p-2.5 bg-[#f1f1f1] sm:text-xs shadow-md">
        <div className="hidden lg:flex lg:items-center lg:space-x-6 xl:space-x-8">
          {categories.slice(0, 5).map((category, index) => (
            <Link
              key={index}
              to={category.to}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-100"
            >
              <span className="text-lg">{category.icon}</span>
              <span className="hidden sm:inline font-medium">{category.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50 md:hidden">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category, index) => (
                  <Link
                    key={index}
                    to={category.to}
                    className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default CategoryMenu;
