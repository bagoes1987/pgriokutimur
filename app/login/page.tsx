'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [loginType, setLoginType] = useState<'admin' | 'member'>('member')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const endpoint = loginType === 'admin' ? '/api/auth/admin/login' : '/api/auth/member/login'
      const body = loginType === 'admin' 
        ? { username, password }
        : { email, password }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        const redirectPath = loginType === 'admin' ? '/admin/dashboard' : '/member/dashboard'
        router.push(redirectPath)
      } else {
        setError(data.message || data.error || 'Login gagal')
      }
    } catch (error) {
      setError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6 border border-gray-100">
          
          {/* Header Section */}
          <div className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src="/images/Logo-pgri-png.svg" 
                alt="Logo PGRI" 
                className="w-20 h-20 mx-auto"
              />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Menu Login
            </h2>
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Portal Resmi PGRI Kabupaten OKU Timur
            </p>
          </div>
          
          {/* Login Type Tabs */}
          <div className="flex rounded-xl bg-gray-50 p-1.5 border border-gray-200">
            <button
              type="button"
              onClick={() => {
                setLoginType('member')
                setError('')
                setUsername('')
                setEmail('')
                setPassword('')
              }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                loginType === 'member'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-sm'
              }`}
            >
              Login Member
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginType('admin')
                setError('')
                setUsername('')
                setEmail('')
                setPassword('')
              }}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                loginType === 'admin'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-sm'
              }`}
            >
              Login Admin
            </button>
          </div>

          {/* Form Section */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-3">
              {loginType === 'admin' ? (
                <div>
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white focus:bg-white shadow-sm"
                    placeholder="Masukkan username admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white focus:bg-white shadow-sm"
                    placeholder="Masukkan email member"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="appearance-none relative block w-full px-4 py-3 pr-12 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 bg-gray-50 hover:bg-white focus:bg-white shadow-sm"
                    placeholder={`Masukkan password ${loginType}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Forgot Password Link - Only show for member login */}
            {loginType === 'member' && (
              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition duration-200 cursor-pointer"
                >
                  Lupa Password?
                </Link>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </div>
                ) : (
                  'Login'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="flex-1 flex justify-center py-3 px-4 border border-red-300 rounded-lg shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}