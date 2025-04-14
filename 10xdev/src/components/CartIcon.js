'use client';
import { useProducts } from '@/context/ProductContext';
import { useRouter } from 'next/navigation';
import { FaShoppingCart } from 'react-icons/fa';

export default function CartIcon() {
  const { cart } = useProducts();
  const router = useRouter();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
    router.push('/cart'); // Navigate directly to cart page
  };

  return (
    <div className="relative">
      <button
        onClick={handleCartClick}
        className="fixed top-6 right-6 z-50 bg-gray-800 text-white p-3.5 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300"
        aria-label="View shopping cart"
      >
        <FaShoppingCart className="text-2xl" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-7 h-7 rounded-full flex items-center justify-center font-bold">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>
    </div>
  );
}
