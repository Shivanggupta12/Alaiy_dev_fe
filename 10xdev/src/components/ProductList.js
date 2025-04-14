'use client';
import { useState, useEffect } from 'react';
import { useProducts } from '@/context/ProductContext';
import ProductCard from './ProductCard';
import { Search, Filter, ShoppingBag, X , Grid} from 'lucide-react';

export default function ProductList() {
  const { products, loading, error } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [displayMode, setDisplayMode] = useState('grid');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const categories = ['all', ...new Set(products?.map(product => product.category) || [])];
  const categoryCounts = products?.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const filteredProducts = products?.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = !searchQuery || 
                         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

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
      default:
        return 0;
    }
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="w-12 h-12 border-4 border-neutral-700 border-t-white rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900 text-white">
        <div className="p-6 border border-neutral-800 rounded-lg bg-neutral-900 text-center">
          <p className="text-red-400 text-xl">Error loading products</p>
          <p className="text-sm mt-2 text-gray-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded bg-white text-black hover:bg-gray-200 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-stone-900 text-white">
      {/* Search Bar */}
      <div className="mb-8">
        <div className={`flex items-center p-3 rounded-lg transition-all ${isSearchFocused ? 'bg-stone-700 ring-2 ring-stone-500' : 'bg-stone-800'}`}>
          <Search size={20} className="mr-2 text-gray-400" />
          <input
            id="search-input"
            type="text"
            placeholder="Search products... (Ctrl+K)"
            className="w-full bg-transparent outline-none text-white placeholder-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-stone-800 rounded hover:bg-white/10"
            >
              <Filter size={18} />
              <span>Filters</span>
              <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">
                {selectedCategory !== 'all' ? '1' : '0'}
              </span>
            </button>
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full">
                <span>{selectedCategory}</span>
                <button onClick={() => setSelectedCategory('all')}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Display mode toggle */}
            <div className="hidden md:flex items-center bg-neutral-900 rounded">
              <button
                onClick={() => setDisplayMode('grid')}
                className={`px-3 py-1 ${displayMode === 'grid' ? 'bg-white/10' : ''}`}
              >
                <Grid></Grid>
              </button>
              <button
                onClick={() => setDisplayMode('list')}
                className={`px-3 py-1 ${displayMode === 'list' ? 'bg-white/10' : ''}`}
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
                className="bg-neutral-900 border border-neutral-700 rounded px-3 py-1 text-white"
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

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 p-4 bg-neutral-900 rounded-lg border border-white/10">
            <h3 className="font-medium mb-3 text-white">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition ${
                    selectedCategory === category
                      ? 'bg-white text-black border-white'
                      : 'bg-black border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  {category !== 'all' && categoryCounts && (
                    <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                      {categoryCounts[category] || 0}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-400 mb-4">
        {sortedProducts.length === 0
          ? 'No products found'
          : `Showing ${sortedProducts.length} ${sortedProducts.length === 1 ? 'product' : 'products'}`}
      </div>

      {/* Product Display */}
      {sortedProducts.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900 rounded-lg border border-white/10">
          <ShoppingBag size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No products found</h3>
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
            <div key={product._id || product.name} className="flex bg-neutral-900 rounded-lg overflow-hidden border border-white/10">
              <div className="w-32 h-32 bg-white/5">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.jpg";
                    e.target.onerror = null;
                  }}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium text-white">{product.name}</h3>
                    <span className="text-lg font-semibold text-white">Rs.{product.price}</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-white/10 px-2 py-1 rounded">{product.category}</span>
                  <button
                    onClick={() => console.log("Add to cart")}
                    className="bg-white text-black px-4 py-1 rounded hover:bg-gray-200 transition"
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
