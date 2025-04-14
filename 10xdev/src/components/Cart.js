'use client';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';
import { ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useProducts();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, newQuantity);
    updateQuantity(itemId, quantity);
  };

  if (cart.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center bg-stone-900 rounded-lg shadow-lg">
        <ShoppingBag size={64} className="text-stone-600 mb-6" />
        <h2 className="text-3xl font-semibold text-stone-200 mb-3">Your cart is empty</h2>
        <p className="text-stone-400 text-lg">Add some products to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-stone-900 rounded-xl shadow-lg text-stone-200">
      <h2 className="text-3xl font-bold mb-6 text-stone-100 border-b border-stone-700 pb-4">Your Shopping Cart</h2>

      {/* Cart Items */}
      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex flex-col border border-stone-700 rounded-lg p-4 hover:bg-stone-800 transition"
          >
            <div className="flex items-start gap-4 mb-4">
              {/* Image */}
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-stone-800">
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

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-stone-300 truncate mb-1">{item.name}</h3>
                  {/* Remove button moved to top right */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-stone-700 transition ml-2"
                    aria-label="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
                <p className="text-stone-400 text-sm mb-1">{item.category || 'Product'}</p>
                <p className="text-red font-medium">Rs.{item.price.toFixed(2)}</p>
              </div>
            </div>
            
            {/* Bottom row with quantity controls and subtotal */}
            <div className="flex justify-between items-center pt-3 border-t border-stone-700">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="bg-stone-700 hover:bg-stone-600 text-stone-200 disabled:opacity-50 rounded-full w-8 h-8 flex items-center justify-center transition"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                  className="bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-full w-8 h-8 flex items-center justify-center transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right whitespace-nowrap">
                <p className="text-sm text-stone-600">Subtotal</p>
                <p className="font-semibold text-stone-400">Rs.{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-stone-800 p-6 rounded-lg">
        <div className="">
          <div className="flex justify-between text-xl font-semibold mb-6">
            <span>Total</span>
            <span>Rs.{total.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 rounded-lg transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
