import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from "../Utils/api.js";
import { addToCart } from '../Store/cartSlice.js';
import { addToCompare, removeFromCompare } from '../Store/compareSlice.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { API_URL } from "../Utils/config.js";
import { useToast } from "../hooks/useToast.js";
import { FaBalanceScale } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const compareItems = useSelector((state) => state.compare?.items || []);
  const { showToast } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);

        // Update recently viewed products in localStorage
        try {
          const viewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
          const filtered = viewed.filter(p => p._id !== data._id);
          const updated = [data, ...filtered].slice(0, 5);
          localStorage.setItem("recentlyViewed", JSON.stringify(updated));
          setRecentlyViewed(updated);
        } catch (e) {
          console.error("Error updating recently viewed products:", e);
        }

        // Fetch related products
        try {
          const res = await fetch(`${API_URL}/products?limit=0`);
          if (res.ok) {
            const allProducts = await res.json();
            const filtered = allProducts.filter(
              p => p._id !== data._id && (p.type === data.type || (data.category && p.category?._id === data.category?._id))
            );
            setRelatedProducts(filtered.slice(0, 4));
          }
        } catch (err) {
          console.error("Error fetching related products:", err);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Derived variant state
  const availableColors = product ? [...new Set((product.variants || []).map(v => v.color).filter(Boolean))] : [];
  const availableSizes = product ? [...new Set((product.variants || []).map(v => v.size || v.storage).filter(Boolean))] : [];

  const selectedVariant = product?.variants?.find(v => {
    const colorMatch = !selectedColor || v.color === selectedColor;
    const sizeMatch = !selectedSize || v.size === selectedSize || v.storage === selectedSize;
    return colorMatch && sizeMatch;
  }) || null;

  const isOutOfStock = product?.variants?.length > 0
    ? (selectedVariant ? selectedVariant.countInStock === 0 : product.variants.reduce((s, v) => s + (v.countInStock || 0), 0) === 0)
    : false;

  const isInCompare = compareItems.some((item) => item._id === product?._id);

  const handleToggleCompare = () => {
    if (isInCompare) {
      dispatch(removeFromCompare(product._id));
      showToast('Removed from comparison');
    } else {
      if (compareItems.length >= 3) {
        showToast('You can compare up to 3 products at a time.', 'error');
        return;
      }
      dispatch(addToCompare(product));
      showToast('Added to comparison');
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const productToAdd = {
      ...product,
      _id: product._id,
      quantity: quantity,
      selectedVariant: selectedVariant || undefined,
    };
    dispatch(addToCart(productToAdd));
    showToast(`${product.name} added to cart!`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      showToast('Please login to leave a review', 'error');
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setProduct(res.data);
      setReviewComment('');
      setReviewRating(5);
      showToast('Review submitted successfully!');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-current'}`}
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => Math.max(1, prev - 1));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
<Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
              </div>
              <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
<Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate(`/${product.type?.toLowerCase()}s`)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              {product.type}s
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="h-96 bg-white rounded-lg overflow-hidden border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[product.image].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-20 bg-white rounded border-2 overflow-hidden transition-all ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">Rs.{product.price}</span>
                <span className="text-xl text-gray-400 line-through">Rs.{product.price + 5000}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                  Save Rs.{5000}
                </span>
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(product.rating || 0)}</div>
                <span className="text-gray-600">
                  {product.rating ? product.rating.toFixed(1) : '0.0'} ({product.numReviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Variant Selectors */}
            {availableColors.length > 0 && (
              <div>
                <span className="text-gray-700 font-medium block mb-2">Color:</span>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 text-gray-600 hover:border-blue-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {availableSizes.length > 0 && (
              <div>
                <span className="text-gray-700 font-medium block mb-2">Storage / Size:</span>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? 'border-purple-600 bg-purple-50 text-purple-700'
                          : 'border-gray-300 text-gray-600 hover:border-purple-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            {isOutOfStock && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                This variant is currently out of stock
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-4 rounded-lg font-semibold transition-all duration-300 transform ${
                    isOutOfStock
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleToggleCompare}
                  className={`px-4 py-4 rounded-lg border-2 transition-all duration-300 ${
                    isInCompare
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                  }`}
                  title={isInCompare ? 'Remove from comparison' : 'Add to comparison'}
                >
                  <FaBalanceScale className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Key Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Premium quality materials
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Latest technology
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1 year warranty
                </li>
                <li className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Free shipping
                </li>
              </ul>
            </div>

            {/* Tabs */}
            <div className="border-t pt-6">
              <div className="flex space-x-8 border-b">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'description'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'specifications'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'reviews'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reviews
                </button>
              </div>

              <div className="py-6">
                {activeTab === 'description' && (
                  <div className="prose prose-gray max-w-none">
                    <p>
                      Experience the ultimate in performance and design with this premium {product.type}. 
                      Crafted with attention to detail and built to last, this product combines cutting-edge 
                      technology with elegant aesthetics to deliver an exceptional user experience.
                    </p>
                    <p>
                      Whether you're a professional looking for reliability or a casual user seeking convenience, 
                      this {product.type} offers the perfect balance of features and functionality to meet your needs.
                    </p>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-500">Brand:</span>
                        <span className="ml-2 font-medium">SmartTech</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Model:</span>
                        <span className="ml-2 font-medium">ST-2024</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Color:</span>
                        <span className="ml-2 font-medium">Space Gray</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Weight:</span>
                        <span className="ml-2 font-medium">180g</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    {isLoggedIn ? (
                      <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-3">Write a Review</h4>
                        <div className="mb-3">
                          <label className="block text-sm text-gray-600 mb-1">Rating</label>
                          <select
                            value={reviewRating}
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            className="border rounded-lg px-3 py-2"
                          >
                            {[5, 4, 3, 2, 1].map((n) => (
                              <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          rows={3}
                          required
                          className="w-full border rounded-lg px-3 py-2 mb-3"
                        />
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                        >
                          {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    ) : (
                      <p className="text-gray-600">
                        <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">
                          Login
                        </button>
                        {' '}to leave a review.
                      </p>
                    )}

                    {product.reviews?.length > 0 ? (
                      <div className="space-y-4">
                        {product.reviews.map((review, index) => (
                          <div key={index} className="border-b pb-4">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-gray-900">{review.name}</span>
                              <div className="flex">{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-gray-600 text-sm">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p._id}
                onClick={() => {
                  navigate(`/product/${p._id}`);
                  window.scrollTo(0, 0);
                }}
                className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-300 p-4 cursor-pointer group"
              >
                <div className="h-40 bg-gray-50 dark:bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center p-4">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mt-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-gray-900 dark:text-white">Rs.{p.price}</span>
                  <span className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-medium">
                    {p.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Viewed Section */}
      {recentlyViewed.length > 0 && (
        <div className="container mx-auto px-4 py-8 border-t border-gray-200 dark:border-neutral-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Recently Viewed
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recentlyViewed.map((p) => (
              <div
                key={p._id}
                onClick={() => {
                  navigate(`/product/${p._id}`);
                  window.scrollTo(0, 0);
                }}
                className="bg-white dark:bg-neutral-800 rounded-xl border border-gray-100 dark:border-neutral-700 shadow-xs hover:shadow-sm transition-all duration-300 p-3 cursor-pointer group"
              >
                <div className="h-28 bg-gray-50 dark:bg-neutral-900 rounded-lg overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xs font-medium text-gray-700 dark:text-neutral-300 mt-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {p.name}
                </h3>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">Rs.{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
