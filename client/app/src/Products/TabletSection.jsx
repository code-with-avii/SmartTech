import axios from "axios";
import { useDispatch} from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "../Store/cartSlice.js";
import { useMemo } from "react";
import { TabletsHero } from "../components/HeroBanner.jsx";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import TopNavbar from "../components/TopNavbar.jsx";
import { API_URL } from "../Utils/config.js";

const TabletSection = () => {
  const [tablets, setTablets] = useState([]);
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
        const tabletOnly = res.data.filter(
          (item) => item.type && item.type.toLowerCase() === "tablet",
        );
        setTablets(tabletOnly);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // FILTER + SORT LOGIC
  const filtered = useMemo(() => {
    let data = [...tablets];

    // Search
    if (search) {
      data = data.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Price
    if (priceFilter === "low") {
      data = data.filter((m) => m.price < 15000);
    } else if (priceFilter === "mid") {
      data = data.filter((m) => m.price >= 15000 && m.price <= 30000);
    } else if (priceFilter === "high") {
      data = data.filter((m) => m.price > 30000);
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
  }, [tablets, search, priceFilter, brandFilter, sort]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <TopNavbar />
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <TabletsHero />
      </div>
      
      <div className="container mx-auto px-4 pb-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium Tablets Collection
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover our curated selection of high-performance tablets perfect for work, 
            entertainment, and creativity. From professional tablets to budget-friendly options.
          </p>
        </div>
      
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tablets..."
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
                <option value="low">Under 15,000</option>
                <option value="mid">15,000 - 30,000</option>
                <option value="high">Above 30,000</option>
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
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Huawei">Huawei</option>
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
          {filtered.map((tablet) => (
            <div
              key={tablet._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-64 bg-gradient-to-br from-blue-50 to-indigo-50">
                <img
                  src={tablet.image || "/placeholder-tablet.jpg"}
                  alt={tablet.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  12% OFF
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {tablet.name}
                </h3>
                <p className="text-gray-600 mb-4 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {tablet.brand}
                </p>
                
                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900">Rs.{tablet.price}</span>
                    <span className="text-gray-400 line-through text-sm">Rs.{tablet.price + 3000}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">(4.6)</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    High Resolution Display
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Long Battery Life
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Powerful Processor
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      alert("Item added to cart!");
                      handleAddtoCart(tablet);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 font-semibold"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tablets found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default TabletSection;
