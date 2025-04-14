'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { LogIn, UserPlus } from 'lucide-react'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

      if (error) throw error

      if (!isSignUp) {
        router.push('/dashboard')
        router.refresh()
      } else {
        alert('Check your email to confirm your account.')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white bg-no-repeat bg-contain flex justify-end" style={{ backgroundImage: "url('/shopping.jpg')" }}>
      <div className="w-full max-w-xl flex flex-col justify-center bg-white bg-opacity-90 p-8" style={{ backgroundImage: "url('/image.png')" }}>
        <div className='bg-white border border-gray-700 rounded-3xl'>
          <div className="mb-8 p-4">
            <h1 className="text-3xl font-bold text-black mb-2 flex items-center">
              {isSignUp ? <UserPlus className="mr-3" size={28} /> : <LogIn className="mr-3" size={28} />}
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </h1>
            <p className="text-gray-700">
              {isSignUp ? 'Create a new account' : 'Enter your credentials to access your account'}
            </p>
          </div>

          <form onSubmit={handleAuth}>
            <div className="mb-4 px-4">
              <label htmlFor="email" className="block mb-2 text-black">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 bg-white border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="your@email.com"
              />
            </div>
            <div className="mb-6 px-4">
              <label htmlFor="password" className="block mb-2 text-black">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 bg-white border border-black rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 mb-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
                {error}
              </div>
            )}
            <div className='px-4'>
              <button
                type="submit"
                disabled={loading}
                className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:bg-gray-300 disabled:text-gray-500 transition-colors font-medium"
              >
                {loading ? (isSignUp ? 'Signing up...' : 'Signing in...') : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>

              <div className="text-center text-gray-700 text-sm mt-4">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(false)}
                      className="text-black hover:underline"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(true)}
                      className="text-black hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
