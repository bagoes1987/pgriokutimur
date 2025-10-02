'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Menu, 
  X, 
  Home, 
  Newspaper, 
  Users, 
  Search, 
  BarChart3, 
  Info, 
  UserPlus, 
  LogIn, 
  LogOut,
  User
} from 'lucide-react'
import toast from 'react-hot-toast'
// import logoImage from '/public/images/logo-pgri.jpg'

interface User {
  id: number
  name: string
  email?: string
  username?: string
  role: 'admin' | 'member'
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [siteLogo, setSiteLogo] = useState('/images/logo-pgri.svg')
  const [logoError, setLogoError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Auth check error:', error)
      }
    }

    checkAuth()
    // Logo is already set in state
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })

      if (response.ok) {
        setUser(null)
        toast.success('Logout berhasil')
        router.push('/')
        router.refresh()
      } else {
        toast.error('Gagal logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Terjadi kesalahan')
    }
  }

  const publicMenuItems = [
    { href: '/', label: 'Beranda', icon: Home },
    { href: '/berita', label: 'Berita', icon: Newspaper },
    { href: '/pengurus', label: 'Pengurus', icon: Users },
    { href: '/cari-anggota', label: 'Cari Anggota', icon: Search },
    { href: '/statistik', label: 'Statistik', icon: BarChart3 },
    { href: '/tentang', label: 'Tentang', icon: Info },
  ]

  return (
    <header className="bg-white shadow-lg border-b-4 border-pgri-red">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20 gap-4">
          {/* Logo and Site Name */}
          <Link href="/" className="flex items-center space-x-3 flex-shrink-0">
            {siteLogo && !logoError ? (
              <img
                src={siteLogo}
                alt="Logo PGRI OKU Timur"
                className="h-10 w-10 md:h-12 md:w-12 object-contain"
                onError={() => {
                  console.error('Logo failed to load:', siteLogo);
                  setLogoError(true);
                }}
                onLoad={() => console.log('Logo loaded successfully:', siteLogo)}
              />
            ) : (
              <div className="h-10 w-10 md:h-12 md:w-12 bg-pgri-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-pgri-red tracking-tight whitespace-nowrap">
                PGRI Kabupaten OKU Timur
              </h1>
              <p className="text-sm text-gray-600 font-medium whitespace-nowrap">
                Portal Resmi PGRI OKU Timur
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
            {publicMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-lg text-gray-700 hover:text-pgri-red hover:bg-red-50 transition-colors duration-200 whitespace-nowrap"
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-pgri-red hover:bg-red-50 transition-colors duration-200 whitespace-nowrap"
                >
                  <User className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium max-w-32 truncate">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 whitespace-nowrap"
                >
                  <LogOut className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/daftar"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-pgri-green text-white hover:bg-pgri-green-dark transition-colors duration-200 whitespace-nowrap"
                >
                  <UserPlus className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Daftar</span>
                </Link>
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-pgri-red text-white hover:bg-pgri-red-dark transition-colors duration-200 whitespace-nowrap"
                >
                  <LogIn className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Login</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-pgri-red hover:bg-red-50 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 bg-white">
            <nav className="space-y-1">
              {publicMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-700 hover:text-pgri-red hover:bg-red-50 transition-colors duration-200 w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
                {user ? (
                  <>
                    <Link
                      href={user.role === 'admin' ? '/admin/dashboard' : '/member/dashboard'}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-pgri-red hover:bg-red-50 transition-colors duration-200 w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium truncate">{user.name}</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/daftar"
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-pgri-green text-white hover:bg-pgri-green-dark transition-colors duration-200 w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserPlus className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">Daftar</span>
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 px-3 py-3 rounded-lg bg-pgri-red text-white hover:bg-pgri-red-dark transition-colors duration-200 w-full"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">Login</span>
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}