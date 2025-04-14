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

  const fallbackImage = "/download.jpeg";

  const handleImageError = () => setImageError(true);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addToCart(product);
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div
      className="bg-stone-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-stone-600"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden">
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-2 right-2 bg-white text-black p-2 rounded-full z-10 hover:scale-110 transition-transform"
        >
          <Heart size={20} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'} />
        </button>

        <div className={`relative h-full w-full transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}>
          <Image
            src={imageError ? fallbackImage : product.image}
            alt={product.name}
            fill
            className="object-cover"
            onError={handleImageError}
            blurDataURL="data:image/jpeg;base64,..."
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
          />
        </div>

        <div
          className={`absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-60' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleAddToCart}
            className="bg-white text-black px-4 py-2 rounded-full font-medium flex items-center space-x-2 hover:bg-gray-200 transition-colors"
          >
            <ShoppingCart size={18} />
            <span>Quick Add</span>
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-4">
        {/* Category Tag */}
        <span className="text-xs font-medium text-white bg-gray-800 px-2 py-1 rounded-full">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-white mt-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Star Rating */}
        {product.rating && (
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-600'
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">({product.ratingCount || 0})</span>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-400 text-sm mt-2 line-clamp-2 h-10">{product.description}</p>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline">
          <span className="text-xl font-bold text-white">Rs.{product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through ml-2">
              Rs.{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className={`mt-3 w-full flex items-center justify-center space-x-2 py-2 rounded-lg font-medium transition-all duration-300 ${
            isAddingToCart
              ? 'bg-gray-700 text-gray-300'
              : 'bg-white text-black hover:bg-gray-200'
          }`}
        >
          {isAddingToCart ? (
            <span className="text-sm">Added!</span>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span className="text-sm">Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
