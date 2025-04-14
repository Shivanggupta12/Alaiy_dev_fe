'use client';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, products } = useProducts();
  const [isLoading, setIsLoading] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Get recommended products (excluding items already in cart)
  const recommendedProducts = products
    .filter(product => !cart.some(item => item._id === product._id))
    .slice(0, 4);

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, newQuantity);
    updateQuantity(itemId, quantity);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items: cart.map(item => ({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          }))
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }
  
      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe checkout error:', error);
        window.location.href = `/checkout/failure?error=${encodeURIComponent(error.message)}`;
      }
    } catch (error) {
      console.error('Error in checkout process:', error);
      window.location.href = `/checkout/failure?error=${encodeURIComponent(error.message)}`;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header with back button */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-black transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">Back to shop</span>
          </Link>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag size={48} className="text-gray-200 mb-6" />
            <h2 className="text-2xl font-medium text-gray-800 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some products to get started</p>
            <Link 
              href="/dashboard" 
              className="px-8 py-3 bg-black text-white text-sm font-medium hover:bg-gray-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items Table - Takes up 2/3 of the space */}
            <div className="lg:w-2/3">
              {/* Table Header */}
              <div className="hidden lg:grid grid-cols-12 border-b border-gray-200 pb-4 mb-4 text-sm font-medium text-gray-500">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-right">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>
              
              {/* Table Body */}
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item._id} className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center py-4 border-b border-gray-100">
                    {/* Product Info - Mobile & Desktop */}
                    <div className="col-span-1 lg:col-span-6 flex items-center gap-4">
                      {/* Product image */}
                      <div className="relative w-16 h-16 bg-gray-50 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder-product.jpg";
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                      
                      {/* Product details */}
                      <div>
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="text-xs text-gray-400 mt-1">{item.category || 'Product'}</p>
                      </div>
                    </div>
                    
                    {/* Price - Desktop */}
                    <div className="hidden lg:block lg:col-span-2 text-right text-sm">
                      Rs.{item.price.toFixed(2)}
                    </div>
                    
                    {/* Mobile layout for Price, Quantity, Subtotal */}
                    <div className="col-span-1 lg:hidden grid grid-cols-3 gap-2 items-center">
                      <div className="text-sm">
                        <p className="text-xs text-gray-400">Price</p>
                        <p>Rs.{item.price.toFixed(2)}</p>
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-xs text-gray-400 mb-1">Quantity</p>
                        <div className="flex border border-gray-200 w-20">
                          <button 
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="px-2 py-1 disabled:opacity-30"
                          >
                            <Minus size={12} />
                          </button>
                          <input 
                            type="text" 
                            value={item.quantity}
                            readOnly
                            className="w-6 text-center text-sm"
                          />
                          <button 
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            className="px-2 py-1"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-xs text-gray-400">Subtotal</p>
                        <p>Rs.{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    {/* Quantity - Desktop */}
                    <div className="hidden lg:flex lg:col-span-2 justify-center">
                      <div className="flex border border-gray-200">
                        <button 
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 disabled:opacity-30"
                        >
                          <Minus size={12} />
                        </button>
                        <input 
                          type="text" 
                          value={item.quantity}
                          readOnly
                          className="w-6 text-center text-sm"
                        />
                        <button 
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="px-2 py-1"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Subtotal & Remove - Desktop */}
                    <div className="hidden lg:flex lg:col-span-2 justify-between items-center">
                      <span className="text-sm">Rs.{(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {/* Remove button - Mobile */}
                    <div className="col-span-1 flex lg:hidden justify-end">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-gray-400 hover:text-gray-600"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Details - Takes up 1/3 of the space */}
            <div className="lg:w-1/3">
              <div className="border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-6">Order Details</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span>Sub Total</span>
                    <span className="font-medium">Rs.{total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Tax</span>
                    <span>0</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="font-medium">Total Amount</span>
                    <span className="font-medium">Rs.{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-black text-white text-sm font-medium py-3 hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : `Pay Rs.${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products for You Section */}
        {cart.length > 0 && recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More products for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
