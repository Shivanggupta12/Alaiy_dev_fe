'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { ProductProvider, useProducts } from '@/context/ProductContext'
import ProductCard from '@/components/ProductCard'
import CartIcon from '@/components/CartIcon'
import { LogOut, Search, Filter, X, Grid, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const { products, loading: productLoading, error } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('featured')
  const [displayMode, setDisplayMode] = useState('grid')
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const categories = ['all', ...new Set(products?.map(product => product.category) || [])]
  const categoryCounts = products?.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1
    return acc
  }, {})

  const filteredProducts = products?.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = !searchQuery || 
                         product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  }) || []

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price)
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price)
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/signin')
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.getElementById('search-input')?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-gray-800">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (productLoading) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-100 rounded w-1/4"></div>
            <div className="h-4 bg-gray-100 rounded w-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProductProvider>
      <div className="min-h-screen bg-white">
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="fixed top-6 right-20 z-50 bg-gray-800 text-white p-3.5 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300"
          aria-label="Sign out"
        >
          <LogOut className="text-xl" />
        </button>
        
        <div className="container mx-auto px-4 py-14">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-gray-900">Our Products</h1>
              <p className="text-gray-600">Discover our collection of products</p>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className={`flex items-center p-3 rounded-lg transition-all ${isSearchFocused ? 'bg-gray-100 ring-2 ring-gray-800' : 'bg-gray-50'}`}>
                <Search size={20} className="mr-2 text-gray-400" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search products... (Ctrl+K)"
                  className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-900"
                  >
                    <Filter size={18} />
                    <span>Filters</span>
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                      {selectedCategory !== 'all' ? '1' : '0'}
                    </span>
                  </button>
                  {selectedCategory !== 'all' && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                      <span className="text-gray-900">{selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('all')}>
                        <X size={14} className="text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Display mode toggle */}
                  <div className="hidden md:flex items-center bg-gray-100 rounded">
                    <button
                      onClick={() => setDisplayMode('grid')}
                      className={`px-3 py-1 ${displayMode === 'grid' ? 'bg-gray-200' : ''}`}
                    >
                      <Grid className="text-gray-900" />
                    </button>
                    <button
                      onClick={() => setDisplayMode('list')}
                      className={`px-3 py-1 ${displayMode === 'list' ? 'bg-gray-200' : ''}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" className='text-black'></line>
                        <line x1="8" y1="12" x2="21" y2="12" className='text-black'></line>
                        <line x1="8" y1="18" x2="21" y2="18" className='text-black'></line>
                        <line x1="3" y1="6" x2="3.01" y2="6" className='text-black'></line>
                        <line x1="3" y1="12" x2="3.01" y2="12" className='text-black'></line>
                        <line x1="3" y1="18" x2="3.01" y2="18" className='text-black'></line>
                      </svg>
                    </button>
                  </div>

                  {/* Sort dropdown */}
                  <div className="flex items-center">
                    <span className="text-gray-600 mr-2 hidden md:inline">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white border border-gray-200 rounded px-3 py-1 text-gray-900"
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
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-3 text-gray-900">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full border transition ${
                          selectedCategory === category
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                        {category !== 'all' && categoryCounts && (
                          <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
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
            <div className="text-sm text-gray-600 mb-4">
              {sortedProducts.length === 0
                ? 'No products found'
                : `Showing ${sortedProducts.length} ${sortedProducts.length === 1 ? 'product' : 'products'}`}
            </div>

            {/* Product Display */}
            {sortedProducts.length === 0 ? (
              <div className="p-12 text-center bg-gray-50 rounded-lg border border-gray-200">
                <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try changing your search or filter criteria</p>
              </div>
            ) : displayMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedProducts.map((product) => (
                  <div key={product._id} className="flex bg-white rounded-lg overflow-hidden border border-gray-200">
                    <div className="w-32 h-32 bg-gray-100">
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
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <span className="text-lg font-semibold text-gray-900">Rs.{product.price}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-900">{product.category}</span>
                        <button
                          onClick={() => console.log("Add to cart")}
                          className="bg-gray-900 text-white px-4 py-1 rounded hover:bg-gray-800 transition"
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
        </div>
        
        <Link href="/cart" className="fixed top-6 right-6 z-50">
          <CartIcon />
        </Link>
      </div>
    </ProductProvider>
  )
}
