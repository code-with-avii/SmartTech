import axios from "axios";
import { useDispatch} from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "../Store/cartSlice.js";
import { useMemo } from "react";
import { DronesHero } from "../components/HeroBanner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import TopNavbar from "../components/TopNavbar";
import { API_URL } from "../Utils/config.js";

const DroneSection = () => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);

  const [priceFilter, setPriceFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        const droneOnly = res.data.filter(
          (item) => item.type && item.type.toLowerCase() === "drone",
        );
        setDrones(droneOnly);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // FILTER + SORT LOGIC
  const filtered = useMemo(() => {
    let data = [...drones];

    // Search
    if (search) {
      data = data.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Price
    if (priceFilter === "low") {
      data = data.filter((m) => m.price < 20000);
    } else if (priceFilter === "mid") {
      data = data.filter((m) => m.price >= 20000 && m.price <= 50000);
    } else if (priceFilter === "high") {
      data = data.filter((m) => m.price > 50000);
    }

    // Brand
    if (brandFilter) {
      data = data.filter((m) =>
        m.brand && m.brand.toLowerCase() === brandFilter.toLowerCase(),
      );
    }

    // Sort
    if (sort === "low-high") {
      data.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      data.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    return data;
  }, [drones, search, priceFilter, brandFilter, sort]);

  const handleAddtoCart = (product) => {
    dispatch(addToCart(product));
  };

  // LOADING SKELETON
  if (loading) {
    return (
      <div className="flex gap-4 p-4 bg-gray-100 min-h-screen">
        {/* Sidebar skeleton */}
        <div className="w-1/4 bg-white p-5 rounded-xl shadow hidden md:block">
          <div className="h-6 bg-gray-300 mb-4 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* Product grid skeleton */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl shadow">
              <div className="h-40 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 mb-2"></div>
              <div className="h-4 bg-gray-300 mt-3 w-3/4"></div>
              <div className="h-4 bg-gray-300 mt-2 w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopNavbar />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <DronesHero />
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional Drones
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our premium collection of aerial photography drones. 
            Perfect for professionals, hobbyists, and content creators.
          </p>
        </div>
      
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search drones..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="low">Under 25,000</option>
                <option value="mid">25,000 - 50,000</option>
                <option value="high">Above 50,000</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                onChange={(e) => setBrandFilter(e.target.value)}
              >
                <option value="">All Brands</option>
                <option value="DJI">DJI</option>
                <option value="Parrot">Parrot</option>
                <option value="Skydio">Skydio</option>
                <option value="Autel">Autel</option>
                <option value="Yuneec">Yuneec</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setPriceFilter("");
                setBrandFilter("");
                setSearch("");
                setSort("");
              }}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((drone) => (
            <div
              key={drone._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-64 bg-gradient-to-br from-blue-50 to-purple-50">
                <img
                  src={drone.image || "/placeholder-drone.jpg"}
                  alt={drone.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  15% OFF
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {drone.name}
                </h3>
                <p className="text-gray-600 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {drone.brand}
                </p>
                
                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900">Rs.{drone.price}</span>
                    <span className="text-gray-400 line-through text-sm">Rs.{drone.price + 8000}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">(4.8)</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Advanced Flight Controls
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    30min Flight Time
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    GPS Navigation
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      alert("Item added to cart!");
                      handleAddtoCart(drone);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-semibold"
                  >
                    Add to Cart
                  </button>

                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No drones found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default DroneSection;
