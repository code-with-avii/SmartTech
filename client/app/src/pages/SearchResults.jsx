import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { API_URL } from "../Utils/config.js";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const trimmedQuery = query.trim();
  const [products, setProducts] = useState([]);
  const [fetchedFor, setFetchedFor] = useState("");

  const loading = Boolean(trimmedQuery) && fetchedFor !== trimmedQuery;

  useEffect(() => {
    if (!trimmedQuery) return;

    let cancelled = false;

    axios
      .get(`${API_URL}/products`, { params: { search: trimmedQuery } })
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data);
          setFetchedFor(trimmedQuery);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setFetchedFor(trimmedQuery);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [trimmedQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
<Navbar />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-600 mb-8">
          {trimmedQuery ? (
            <>
              Showing results for <span className="font-semibold">&quot;{trimmedQuery}&quot;</span>
            </>
          ) : (
            "Enter a search term to find products"
          )}
        </p>

        {loading && <p className="text-gray-500 text-center py-12">Searching...</p>}

        {!loading && trimmedQuery && products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
            <p className="text-gray-600">No products found for &quot;{trimmedQuery}&quot;</p>
            <Link to="/" className="inline-block mt-4 text-blue-600 hover:underline">
              Browse all products
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-shadow overflow-hidden group"
            >
              <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{product.type}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">₹{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
