'use client';
import Image from 'next/image';
import { useProducts } from '@/context/ProductContext';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart } = useProducts();
  const [imageError, setImageError] = useState(false);
  
  // Fallback image URL - you can replace this with your own fallback image
  const fallbackImageUrl = "https://via.placeholder.com/400x400?text=Product+Image+Not+Available";

  // Function to handle image load errors
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={imageError ? fallbackImageUrl : product.image}
          alt={product.name}
          fill
          className="object-cover"
          onError={handleImageError}
          // Add loading blur placeholder
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LC0yMjoyNzk7PTQ/OT06NDk7QUFBTkJOUlNSMj9BRVFRTkL/2wBDAR"
          placeholder="blur"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
        <div className="mt-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
} 