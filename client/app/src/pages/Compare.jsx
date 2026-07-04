import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCompare, clearCompare } from '../Store/compareSlice.js';
import { addToCart } from '../Store/cartSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { useToast } from '../hooks/useToast.js';
import { FaTrash, FaShoppingCart, FaBalanceScale } from 'react-icons/fa';

const COMPARE_FIELDS = [
  { label: 'Price', key: 'price', render: (v) => v != null ? `Rs.${v.toLocaleString('en-IN')}` : '—' },
  { label: 'Rating', key: 'rating', render: (v) => v != null ? `${Number(v).toFixed(1)} / 5` : '—' },
  { label: 'Reviews', key: 'numReviews', render: (v) => v != null ? v : '—' },
  { label: 'Type / Category', key: 'type', render: (v) => v || '—' },
  { label: 'Stock', key: 'variants', render: (v) => {
    if (!v || v.length === 0) return 'In Stock';
    const total = v.reduce((s, vr) => s + (vr.countInStock || 0), 0);
    return total === 0 ? (
      <span className="text-red-600 font-semibold">Out of Stock</span>
    ) : (
      <span className="text-green-600 font-semibold">{total} units</span>
    );
  }},
  { label: 'Colors', key: 'variants', render: (v) => {
    if (!v || v.length === 0) return '—';
    const colors = [...new Set(v.map(vr => vr.color).filter(Boolean))];
    return colors.length > 0 ? (
      <div className="flex flex-wrap gap-1 justify-center">
        {colors.map(c => <span key={c} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{c}</span>)}
      </div>
    ) : '—';
  }, uniqueKey: 'colors'},
  { label: 'Storage / Size', key: 'variants', render: (v) => {
    if (!v || v.length === 0) return '—';
    const sizes = [...new Set(v.map(vr => vr.size || vr.storage).filter(Boolean))];
    return sizes.length > 0 ? (
      <div className="flex flex-wrap gap-1 justify-center">
        {sizes.map(s => <span key={s} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{s}</span>)}
      </div>
    ) : '—';
  }, uniqueKey: 'sizes'},
  { label: 'Warranty', key: 'warranty', render: (v) => v || '—' },
  { label: 'Description', key: 'description', render: (v) => v ? (
    <span className="text-xs text-gray-600 line-clamp-3">{v}</span>
  ) : '—' },
];

const Compare = () => {
  const { items } = useSelector((state) => state.compare);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleAddToCart = (product) => {
    const firstInStock = product.variants?.find(v => (v.countInStock || 0) > 0);
    dispatch(addToCart({ ...product, selectedVariant: firstInStock || undefined }));
    showToast(`${product.name} added to cart!`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
<Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-24 px-4">
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center max-w-md w-full">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBalanceScale className="text-indigo-400 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Products to Compare</h2>
            <p className="text-gray-500 mb-8">
              Browse products and click the <FaBalanceScale className="inline text-green-500" /> icon to add them here for side-by-side comparison.
            </p>
            <Link
              to="/"
              className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
<Navbar />

      <main className="flex-1 container mx-auto px-4 py-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <FaBalanceScale className="text-indigo-600" />
              Compare Products
            </h1>
            <p className="text-gray-500 mt-1 text-sm">{items.length} product{items.length !== 1 ? 's' : ''} selected (max 3)</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => dispatch(clearCompare())}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              <FaTrash className="text-xs" /> Clear All
            </button>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              + Add More
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Product Headers */}
          <div className={`grid border-b`} style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}>
            <div className="p-6 bg-gray-50 border-r flex items-end">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Feature</span>
            </div>
            {items.map((product) => (
              <div key={product._id} className="p-6 text-center border-r last:border-r-0 relative">
                <button
                  onClick={() => dispatch(removeFromCompare(product._id))}
                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                  title="Remove from comparison"
                >
                  <FaTrash className="text-xs" />
                </button>

                <Link to={`/product/${product._id}`}>
                  <div className="w-32 h-32 mx-auto mb-4 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center hover:ring-2 hover:ring-indigo-300 transition-all">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-3"
                      onError={(e) => { e.target.src = 'https://placehold.co/200x200'; }}
                    />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-indigo-600 transition-colors mb-1">{product.name}</h3>
                </Link>
                <p className="text-indigo-600 font-extrabold text-lg">Rs.{product.price?.toLocaleString('en-IN')}</p>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 w-full py-2 px-3 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* Comparison Rows */}
          {COMPARE_FIELDS.map((field, idx) => (
            <div
              key={field.uniqueKey || field.key + idx}
              className={`grid border-b last:border-b-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
              style={{ gridTemplateColumns: `200px repeat(${items.length}, 1fr)` }}
            >
              <div className="p-4 border-r flex items-center">
                <span className="text-sm font-semibold text-gray-700">{field.label}</span>
              </div>
              {items.map((product) => {
                const value = product[field.key];
                const rendered = field.render(value);
                return (
                  <div key={product._id} className="p-4 border-r last:border-r-0 text-center flex items-center justify-center">
                    {typeof rendered === 'string' || typeof rendered === 'number' ? (
                      <span className="text-sm text-gray-700">{rendered}</span>
                    ) : (
                      rendered
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Mobile: card-based compare */}
        <p className="text-center text-gray-400 text-xs mt-6">Scroll horizontally on smaller screens to see all columns.</p>
      </main>

      <Footer />
    </div>
  );
};

export default Compare;
