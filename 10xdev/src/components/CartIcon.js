'use client';
import { useProducts } from '@/context/ProductContext';
import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import Cart from './Cart';

export default function CartIcon() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useProducts();
  const cartRef = useRef(null);

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  // Handle clicks outside of cart to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    }
    
    // Add event listener only when cart is open
    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);
  
  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  // Animation for cart icon when items added
  const [isAnimating, setIsAnimating] = useState(false);
  const prevTotalItems = useRef(totalItems);
  useEffect(() => {
    // Skip initial render
    if (totalItems > prevTotalItems.current) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
    
    prevTotalItems.current = totalItems;
  }, [totalItems]);

  return (
    <div className="relative">
      {/* Cart Icon Button - Only visible when cart is closed */}
      {!isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className={`fixed top-6 right-6 z-50 bg-gray-700 text-white p-3.5 rounded-full shadow-lg hover:bg-stone-800 transition-all duration-300 ${
              isAnimating ? 'scale-125' : 'scale-100'
          }`}
          aria-label="Open shopping cart"
          >
          <FaShoppingCart className="text-2xl" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold">
              {totalItems > 99 ? '99+' : totalItems}
            </span>
          )}
        </button>
      )}

      {/* Cart Sliding Panel */}
      <div
        ref={cartRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cart Header */}
        <div className="bg-gray-800 text-gray-100 p-6 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-2xl font-bold flex items-center">
            <FaShoppingCart className="mr-3" />
            Your Cart {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close cart"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="h-full overflow-y-auto pb-24 pt-4 px-2">
          <Cart />
        </div>
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 ${
          isCartOpen ? 'opacity-70' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />
    </div>
  );
}
