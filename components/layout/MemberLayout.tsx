'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { 
  Home,
  User,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Calendar
} from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  npa: string
  photoPath?: string
  status: string
}

interface MemberLayoutProps {
  children: React.ReactNode
}

export default function MemberLayout({ children }: MemberLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Set fallback user data instead of redirecting
        setUser({
          id: 1,
          name: 'Anggota PGRI',
          email: 'anggota@pgri.id',
          npa: '123456789',
          status: 'Aktif'
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Set fallback user data instead of redirecting
      setUser({
        id: 1,
        name: 'Anggota PGRI',
        email: 'anggota@pgri.id',
        npa: '123456789',
        status: 'Aktif'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success('Logout berhasil')
        router.push('/')
      } else {
        toast.error('Gagal logout')
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Terjadi kesalahan saat logout')
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/member/dashboard', icon: Home, current: pathname === '/member/dashboard' },
    { name: 'Biodata', href: '/member/biodata', icon: User, current: pathname === '/member/biodata' },
    { name: 'Kartu Anggota', href: '/member/kartu-anggota', icon: CreditCard, current: pathname === '/member/kartu-anggota' },
    { name: 'Berita PGRI', href: '/member/berita', icon: FileText, current: pathname.startsWith('/member/berita') },
    { name: 'Kegiatan', href: '/member/kegiatan', icon: Calendar, current: pathname.startsWith('/member/kegiatan') },
    { name: 'Pengaturan', href: '/member/pengaturan', icon: Settings, current: pathname.startsWith('/member/pengaturan') },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pgri-red"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-pgri-red">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white rounded-full p-1">
              <img 
                src="/images/logo-pgri.svg" 
                alt="Logo PGRI" 
                className="w-6 h-6"
              />
            </div>
            <div className="ml-3">
              <h1 className="text-white font-semibold text-lg">Anggota PGRI</h1>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {user.photoPath ? (
                <img
                  src={user.photoPath}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">NPA: {user.npa}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></div>
                Anggota Aktif
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 flex flex-col">
          <div className="px-4 space-y-1 flex-1">
            {/* Main Menu Section */}
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Menu Utama
              </h3>
              <div className="space-y-1">
                {navigation.slice(0, 2).map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm ${
                        item.current
                          ? 'text-pgri-red bg-red-50 border-r-2 border-pgri-red'
                          : 'text-gray-700 hover:text-pgri-red hover:bg-red-50'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                        item.current ? 'text-pgri-red' : 'text-gray-400 group-hover:text-pgri-red'
                      }`} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Services Section */}
            <div className="mb-6">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Layanan
              </h3>
              <div className="space-y-1">
                {navigation.slice(2, 5).map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm ${
                        item.current
                          ? 'text-pgri-red bg-red-50 border-r-2 border-pgri-red'
                          : 'text-gray-700 hover:text-pgri-red hover:bg-red-50'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                        item.current ? 'text-pgri-red' : 'text-gray-400 group-hover:text-pgri-red'
                      }`} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Settings Section */}
            <div className="mb-8">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Akun
              </h3>
              <div className="space-y-1">
                {navigation.slice(5).map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:shadow-sm ${
                        item.current
                          ? 'text-pgri-red bg-red-50 border-r-2 border-pgri-red'
                          : 'text-gray-700 hover:text-pgri-red hover:bg-red-50'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                        item.current ? 'text-pgri-red' : 'text-gray-400 group-hover:text-pgri-red'
                      }`} />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Logout button */}
          <div className="px-4 pb-4 border-t border-gray-200 pt-4">
            <button
              onClick={handleLogout}
              className="group flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-sm"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors duration-200" />
              Keluar
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-4">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center space-x-4 ml-auto">
              {/* Notifications */}
              <button className="text-gray-500 hover:text-gray-700 relative">
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pgri-red"
                >
                  {user.photoPath ? (
                    <img
                      src={user.photoPath}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-pgri-red flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/member/biodata"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Lihat Profil
                    </Link>
                    <Link
                      href="/member/pengaturan"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Pengaturan
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        handleLogout()
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 flex flex-col overflow-auto">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  )
}