'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { ProductProvider } from '@/context/ProductContext'
import ProductList from '@/components/ProductList'
import CartIcon from '@/components/CartIcon'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <ProductProvider>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
            <div className="lg:col-span-7">
              <ProductList />
            </div>
            <div className="lg:col-span-1">
              <CartIcon />
          </div>
        </div>
      </div>
    </ProductProvider>
  )
}
