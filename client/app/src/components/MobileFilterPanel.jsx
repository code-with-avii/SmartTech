import React from 'react';

const MobileFilterPanel = ({ 
  isOpen, 
  onClose, 
  search, 
  setSearch, 
  priceFilter, 
  setPriceFilter, 
  brandFilter, 
  setBrandFilter, 
  sort, 
  setSort, 
  type,
  onClearFilters 
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'price':
        setPriceFilter(value);
        break;
      case 'brand':
        setBrandFilter(value);
        break;
      case 'sort':
        setSort(value);
        break;
      case 'search':
        setSearch(value);
        break;
      default:
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleOverlayClick}
      />
      
      {/* Panel */}
      <div className="fixed inset-y-0 left-0 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Search ${type.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="mobile-price"
                    checked={priceFilter === "low"}
                    onChange={() => handleFilterChange('price', 'low')}
                    className="mr-3 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">Under 10,000</span>
                </label>
                <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="mobile-price"
                    checked={priceFilter === "mid"}
                    onChange={() => handleFilterChange('price', 'mid')}
                    className="mr-3 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">10,000 - 30,000</span>
                </label>
                <label className="flex items-center cursor-pointer p-2 rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name="mobile-price"
                    checked={priceFilter === "high"}
                    onChange={() => handleFilterChange('price', 'high')}
                    className="mr-3 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm">Above 30,000</span>
                </label>
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
              <select
                value={brandFilter}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Brands</option>
                {type === 'mobile' && (
                  <>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Realme">Realme</option>
                  </>
                )}
                {type === 'laptop' && (
                  <>
                    <option value="Dell">Dell</option>
                    <option value="HP">HP</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Apple">Apple</option>
                    <option value="Asus">Asus</option>
                  </>
                )}
                {type === 'tablet' && (
                  <>
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Lenovo">Lenovo</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Huawei">Huawei</option>
                  </>
                )}
                {type === 'drone' && (
                  <>
                    <option value="DJI">DJI</option>
                    <option value="Parrot">Parrot</option>
                    <option value="Skydio">Skydio</option>
                    <option value="Autel">Autel</option>
                    <option value="Yuneec">Yuneec</option>
                  </>
                )}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t space-y-3">
            <button
              onClick={onClearFilters}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300 font-semibold"
            >
              Clear All Filters
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterPanel;
