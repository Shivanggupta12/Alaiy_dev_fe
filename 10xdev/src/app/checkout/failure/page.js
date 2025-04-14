'use client'; // If using App Router

import Link from 'next/link';
import { useSearchParams } from 'next/navigation'; // For App Router
// import { useRouter } from 'next/router'; // For Pages Router

export default function CheckoutFailure() {
  const searchParams = useSearchParams(); // For App Router
  // const router = useRouter(); // For Pages Router
  
  const error = searchParams.get('error'); // For App Router
  // const { error } = router.query; // For Pages Router
  
  return (
    <div className="p-6 bg-stone-900 rounded-xl shadow-lg text-stone-200 max-w-2xl mx-auto my-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4 text-red-500">Payment Not Completed</h2>
        
        <p className="text-stone-300 mb-6">
          {error 
            ? `There was an issue with your payment: ${error}` 
            : "Your payment was not completed. No charges were made to your account."}
        </p>
        
        <div className="flex justify-center gap-4">
          <Link href="/cart" className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-lg transition">
            Return to Cart
          </Link>
          <Link href="/" className="bg-stone-700 hover:bg-stone-600 text-white font-medium py-2 px-4 rounded-lg transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
