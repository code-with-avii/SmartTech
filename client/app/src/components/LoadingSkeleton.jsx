import React from 'react';

// Product Card Skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    {/* Image Skeleton */}
    <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300"></div>
    
    {/* Content Skeleton */}
    <div className="p-6 space-y-4">
      {/* Title Skeleton */}
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      
      {/* Rating Skeleton */}
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-12"></div>
      </div>
      
      {/* Price Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      
      {/* Features Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      {/* Button Skeleton */}
      <div className="h-12 bg-gray-200 rounded-lg"></div>
    </div>
  </div>
);

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[...Array(count)].map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Category Page Skeleton
export const CategoryPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="container mx-auto px-4 py-12">
      {/* Header Skeleton */}
      <div className="text-center mb-12">
        <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
      </div>
      
      {/* Filters Skeleton */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
      
      {/* Products Grid Skeleton */}
      <ProductGridSkeleton count={8} />
    </div>
  </div>
);

// Cart Item Skeleton
export const CartItemSkeleton = () => (
  <div className="bg-white rounded-xl shadow p-6 animate-pulse">
    <div className="flex gap-6">
      {/* Image Skeleton */}
      <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
      
      {/* Content Skeleton */}
      <div className="flex-1 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex items-center gap-4">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
      
      {/* Price Skeleton */}
      <div className="text-right space-y-2">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
);

// Cart Page Skeleton
export const CartPageSkeleton = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    {/* Header Skeleton */}
    <div className="bg-white shadow-sm p-6">
      <div className="container mx-auto">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
    
    {/* Main Content */}
    <div className="flex-1 container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, index) => (
            <CartItemSkeleton key={index} />
          ))}
        </div>
        
        {/* Order Summary Skeleton */}
        <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="border-t pt-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Hero Banner Skeleton
export const HeroBannerSkeleton = () => (
  <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-lg overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center text-center px-4">
      <div className="space-y-4">
        <div className="h-12 bg-gray-400 rounded w-1/2 mx-auto"></div>
        <div className="h-8 bg-gray-400 rounded w-3/4 mx-auto"></div>
        <div className="h-6 bg-gray-400 rounded w-2/3 mx-auto"></div>
        <div className="h-12 bg-gray-400 rounded w-32 mx-auto"></div>
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
