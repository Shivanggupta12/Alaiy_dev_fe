'use client'; // If using App Router

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // For App Router
// import { useRouter } from 'next/router'; // For Pages Router
import Link from 'next/link';

export default function CheckoutSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams(); // For App Router
  // const { session_id } = router.query; // For Pages Router
  const session_id = searchParams.get('session_id'); // For App Router
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!session_id) return;

    // Optional: Verify the payment on the server
    async function verifyPayment() {
      try {
        const response = await fetch(`/api/verify-payment?session_id=${session_id}`);
        if (response.ok) {
          setStatus('success');
          // Here you could also clear the cart
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setStatus('error');
      }
    }

    verifyPayment();
  }, [session_id]);

  return (
    <div className="p-6 bg-stone-900 rounded-xl shadow-lg text-stone-200 max-w-2xl mx-auto my-10">
      <div className="text-center">
        {status === 'loading' && (
          <div className="animate-pulse">
            <h2 className="text-3xl font-bold mb-4">Processing your payment...</h2>
            <p className="text-stone-400">Please wait while we confirm your payment.</p>
          </div>
        )}
        
        {status === 'success' && (
          <>
            <h2 className="text-3xl font-bold mb-4 text-green-500">Payment Successful!</h2>
            <p className="text-stone-300 mb-6">Thank you for your purchase. Your order has been processed successfully.</p>
            <div className="flex justify-center gap-4">
              <Link href="/" className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-lg transition">
                Continue Shopping
              </Link>
              <Link href="/orders" className="bg-stone-700 hover:bg-stone-600 text-white font-medium py-2 px-4 rounded-lg transition">
                View Orders
              </Link>
            </div>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h2 className="text-3xl font-bold mb-4 text-red-500">Payment Verification Failed</h2>
            <p className="text-stone-300 mb-6">There was an issue verifying your payment. If you believe this is an error, please contact our support team.</p>
            <Link href="/cart" className="bg-blue-800 hover:bg-blue-900 text-white font-medium py-2 px-4 rounded-lg transition">
              Return to Cart
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
