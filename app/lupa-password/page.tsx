'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PublicLayout from '@/components/layout/PublicLayout'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Email harus diisi')
      return
    }

    if (!email.includes('@')) {
      toast.error('Format email tidak valid')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (data.success) {
        setEmailSent(true)
        toast.success(data.message)
      } else {
        toast.error(data.message || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat memproses permintaan')
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
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
                  Email Terkirim!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Kami telah mengirim link reset password ke email <strong>{email}</strong>. 
                  Silakan cek email Anda dan ikuti instruksi untuk reset password.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    <strong>Catatan:</strong> Link reset password akan expired dalam 1 jam. 
                    Jika Anda tidak menerima email, cek folder spam/junk Anda.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setEmailSent(false)
                      setEmail('')
                    }}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Kirim Ulang Email
                  </button>
                  
                  <Link
                    href="/login"
                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
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

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Lupa Password?
            </h2>
            <p className="text-gray-600">
              Masukkan email Anda dan kami akan mengirim link untuk reset password
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Masukkan email Anda"
                    required
                  />
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
                    Mengirim...
                  </div>
                ) : (
                  'Kirim Link Reset Password'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}