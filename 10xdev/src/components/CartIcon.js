'use client';
import { useProducts } from '@/context/ProductContext';
import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaTimes } from 'react-icons/fa';
import Cart from './Cart';

export default function CartIcon() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart } = useProducts();
  const cartRef = useRef(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    }

    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCartOpen]);

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

  const [isAnimating, setIsAnimating] = useState(false);
  const prevTotalItems = useRef(totalItems);
  useEffect(() => {
    if (totalItems > prevTotalItems.current) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }

    prevTotalItems.current = totalItems;
  }, [totalItems]);

  return (
    <div className="relative">
      {!isCartOpen && (
        <button
          onClick={() => setIsCartOpen(true)}
          className={`fixed top-6 right-6 z-50 bg-stone-700 text-white p-3.5 rounded-full shadow-lg hover:bg-stone-800 transition-all duration-300 ${
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

      <div
        ref={cartRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-stone-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="bg-stone-800 text-stone-100 p-6 flex justify-between items-center border-b border-stone-700">
          <h2 className="text-2xl font-bold flex items-center">
            <FaShoppingCart className="mr-3" />
            Your Cart {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-stone-300 hover:text-white p-2 rounded-full hover:bg-stone-700 transition-colors"
            aria-label="Close cart"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        <div className="h-full overflow-y-auto pb-24 pt-4 px-2">
          <Cart />
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-30 ${
          isCartOpen ? 'opacity-70' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />
    </div>
  );
}
