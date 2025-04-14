'use client';
import Image from 'next/image';
import { useProducts } from '@/context/ProductContext';
import { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useProducts();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Fallback image URL
  const fallbackImageUrl = "https://via.placeholder.com/400x400?text=Product+Image+Not+Available";

  // Function to handle image load errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Function to handle adding to cart with animation
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(product);
    
    // Reset button state after animation
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };

  // Calculate discount percentage if original price exists
  const discount = product.originalPrice ? 
    Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <div 
      className="bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container with badges */}
      <div className="relative h-64 w-full overflow-hidden">    
        
        {/* Favorite button */}
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md z-10 transition-all hover:scale-110"
        >
          <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
        
        {/* Main product image */}
        <div className={`relative h-full w-full transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}>
          <Image
            src={imageError ? fallbackImageUrl : product.image}
            alt={product.name}
            fill
            className="object-cover"
            onError={handleImageError}
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMjoyNzk7PTQ/OT06NDk7QUFBTkJOUlNSMj9BRVFRTkL/2wBDAR"
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>
        
        {/* Quick add overlay that appears on hover */}
        <div 
          className={`absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-60' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="bg-white opacity-100 text-gray-800 px-4 py-2 rounded-full font-medium flex items-center space-x-2 hover:bg-gray-100 transition-colors"
          >
            <ShoppingCart size={18} />
            <span>Quick Add</span>
          </button>
        </div>
      </div>
      
      {/* Product details */}
      <div className="p-4">
        {/* Category tag */}
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        {/* Product name */}
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
        
        {/* Star rating if available */}
        {product.rating && (
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={`${
                  i < Math.floor(product.rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                }`} 
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product.ratingCount || 0})</span>
          </div>
        )}
        
        {/* Description with line clamp */}
        <p className="text-gray-400 text-sm mt-2 line-clamp-2 h-10">{product.description}</p>
        
        {/* Price section */}
        <div className="mt-3 flex items-baseline">
          <span className="text-xl font-bold text-gray-800">
            Rs.{product.price.toFixed(2)}
          </span>
          
          {/* Original price if discounted */}
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through ml-2">
              Rs.{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`mt-3 w-full flex items-center justify-center space-x-2 py-2 rounded-lg transition-all duration-300 ${
            isAddingToCart 
              ? 'bg-green-500 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAddingToCart ? (
            <>
              <span className="text-sm font-medium">Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span className="text-sm font-medium">Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}