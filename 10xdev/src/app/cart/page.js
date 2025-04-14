'use client';
import Cart from '@/components/Cart';
import { ProductProvider } from '@/context/ProductContext';

export default function CartPage() {
  return (
    <ProductProvider>
      <div className="min-h-screen py-8" style={{ backgroundImage: "url('/back.png')"}}>
        <div className="container mx-auto py-auto ">
          <Cart />
        </div>
      </div>
    </ProductProvider>
  );
} 