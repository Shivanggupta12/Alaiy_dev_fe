'use client';
import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext';
import ProductCard from './ProductCard';
import { Search, Filter, ShoppingBag, X } from 'lucide-react';

export default function ProductList() {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [displayMode, setDisplayMode] = useState('grid');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Get unique categories and count products in each
  const categories = ['all', ...new Set(products?.map(product => product.category) || [])];
  const categoryCounts = products?.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  // Filter products based on category and search query
  const filteredProducts = products?.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
                         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default: // 'featured'
        return 0; // assuming default order is already featured
    }
  });

  // Handle keyboard shortcut for search (Ctrl+K or ⌘+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input').focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center bg-gray-900 min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-gray-300 rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-300">Loading products...</p>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center bg-gray-900 min-h-screen">
        <div className="bg-gray-800 p-6 rounded-lg inline-block border border-gray-700">
          <p className="text-xl text-red-400">Error loading products</p>
          <p className="mt-2 text-gray-400">{error}</p>
          <button 
            className="mt-4 px-6 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-gray-200">
      {/* Header with search and filter toggle */}
      <div className="mb-8">
        <div className="relative mb-6">
          <div className={`flex items-center p-3 rounded-lg transition-all ${
            isSearchFocused 
              ? 'bg-gray-700 ring-2 ring-gray-600 shadow-lg' 
              : 'bg-gray-800 text-gray-300'
          }`}>
            <Search size={20} className="mr-2 text-gray-400" />
            <input
              id="search-input"
              type="text"
              placeholder="Search products... (Ctrl+K)"
              className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-300"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
        
        {/* Filter bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Filter size={18} />
              <span>Filters</span>
              <span className="bg-gray-700 text-xs px-2 py-1 rounded-full">
                {selectedCategory !== 'all' ? '1' : '0'}
              </span>
            </button>
            
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-1 px-3 py-1 bg-gray-800 bg-opacity-70 text-gray-300 rounded-full">
                <span>{selectedCategory}</span>
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-gray-100"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* View mode switcher */}
            <div className="hidden md:flex items-center bg-gray-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setDisplayMode('grid')}
                className={`px-3 py-1 ${displayMode === 'grid' ? 'bg-gray-700' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                onClick={() => setDisplayMode('list')}
                className={`px-3 py-1 ${displayMode === 'list' ? 'bg-gray-700' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
            
            {/* Sort dropdown */}
            <div className="flex items-center">
              <span className="text-gray-400 mr-2 hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-1 outline-none focus:border-gray-600 text-gray-200"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Filter panel - expanded */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 animate-fadeIn">
            <h3 className="font-medium mb-3 text-gray-200">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category
                      ? 'bg-gray-700 text-gray-200 border border-gray-600'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  {category !== 'all' && categoryCounts && (
                    <span className="ml-2 text-xs bg-gray-900 px-2 py-0.5 rounded-full">
                      {categoryCounts[category] || 0}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Results summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-400">
          {sortedProducts.length === 0 ? (
            'No products found'
          ) : (
            `Showing ${sortedProducts.length} ${sortedProducts.length === 1 ? 'product' : 'products'}`
          )}
        </div>
      </div>
      
      {/* Product grid/list */}
      {sortedProducts.length === 0 ? (
        <div className="py-20 text-center bg-gray-800 rounded-lg border border-gray-700">
          <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium mb-2 text-gray-300">No products found</h3>
          <p className="text-gray-500">Try changing your search or filter criteria</p>
        </div>
      ) : displayMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id || product.name} product={product} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProducts.map((product) => (
            <div key={product._id || product.name} className="flex bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-all border border-gray-700">
              <div className="w-32 h-32 relative bg-gray-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover h-full w-full"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.jpg";
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-200">{product.name}</h3>
                    <span className="text-xl font-bold text-gray-200">Rs.{product.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                    {product.category}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-gray-700 text-gray-200 px-4 py-1 rounded hover:bg-gray-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
