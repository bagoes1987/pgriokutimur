'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import PublicLayout from '@/components/layout/PublicLayout'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [memberData, setMemberData] = useState<any>(null)
  const [passwordReset, setPasswordReset] = useState(false)
  
  const router = useRouter()
  const params = useParams()
  const token = params.token as string

  useEffect(() => {
    verifyToken()
  }, [token])

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/auth/reset-password/${token}`)
      const data = await response.json()

      if (data.success) {
        setTokenValid(true)
        setMemberData(data)
      } else {
        setTokenValid(false)
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error verifying token:', error)
      setTokenValid(false)
      toast.error('Terjadi kesalahan saat memverifikasi token')
    } finally {
      setVerifying(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!password || !confirmPassword) {
      toast.error('Password dan konfirmasi password harus diisi')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak sama')
      return
    }

    if (password.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, confirmPassword })
      })

      const data = await response.json()

      if (data.success) {
        setPasswordReset(true)
        toast.success(data.message)
      } else {
        toast.error(data.message || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat mereset password')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Memverifikasi token...</p>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (!tokenValid) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Token Tidak Valid
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Link reset password tidak valid atau sudah expired. 
                  Silakan minta link reset password yang baru.
                </p>
                
                <div className="space-y-3">
                  <Link
                    href="/forgot-password"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center"
                  >
                    Minta Link Reset Baru
                  </Link>
                  
                  <Link
                    href="/login"
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors block text-center"
                  >
                    Kembali ke Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (passwordReset) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Password Berhasil Direset!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Password Anda telah berhasil direset. Sekarang Anda dapat login dengan password baru.
                </p>
                
                <Link
                  href="/login"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors block text-center"
                >
                  Login Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600">
              Halo <strong>{memberData?.memberName}</strong>, masukkan password baru Anda
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password Baru
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Konfirmasi password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mereset Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}