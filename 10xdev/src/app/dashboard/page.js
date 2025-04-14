'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { ProductProvider } from '@/context/ProductContext'
import ProductList from '@/components/ProductList'
import CartIcon from '@/components/CartIcon'
import { LogOut } from 'lucide-react'

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/signin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-700 border-t-gray-300 rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-gray-300">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ProductProvider>
      <div className="min-h-screen bg-stone-900">
        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="fixed top-6 right-20 z-50 bg-stone-700 text-gray-200 p-3.5 rounded-full shadow-lg hover:bg-stone-600 transition-all duration-300"
          aria-label="Sign out"
        >
          <LogOut className="text-xl" />
        </button>
        
        <div className="container mx-auto py-14">
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
