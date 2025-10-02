'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { 
  Menu,
  X,
  Home,
  Users,
  UserCheck,
  Newspaper,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Shield,
  FileText,
  Database,
  Globe,
  User
} from 'lucide-react'

interface AdminData {
  id: number
  username: string
  name: string
  email: string
  role: string
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      console.log('AdminLayout: Starting fetchAdminData...')
      console.log('AdminLayout: Current pathname:', pathname)
      
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      console.log('AdminLayout: Response status:', response.status)
      console.log('AdminLayout: Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        const data = await response.json()
        console.log('AdminLayout: Response data:', data)
        
        if (data.success && data.user && data.user.role === 'admin') {
          console.log('AdminLayout: Admin user found, setting data:', data.user)
          setAdminData(data.user)
        } else {
          console.log('AdminLayout: No admin user or invalid role, redirecting to login')
          console.log('AdminLayout: Data success:', data.success)
          console.log('AdminLayout: User role:', data.user?.role)
          router.push('/login')
        }
      } else {
        console.log('AdminLayout: Response not ok, redirecting to login')
        const errorData = await response.text()
        console.log('AdminLayout: Error response:', errorData)
        router.push('/login')
      }
    } catch (error) {
      console.error('AdminLayout: Error fetching admin data:', error)
      router.push('/login')
    } finally {
      console.log('AdminLayout: Setting loading to false')
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      })
      
      if (response.ok) {
        toast.success('Berhasil logout')
        router.push('/')
      } else {
        toast.error('Gagal logout')
      }
    } catch (error) {
      console.error('Error logging out:', error)
      toast.error('Terjadi kesalahan saat logout')
    }
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: Home,
      current: pathname === '/admin/dashboard'
    },
    {
      name: 'Kelola Anggota',
      href: '/admin/anggota',
      icon: Users,
      current: pathname.startsWith('/admin/anggota')
    },
    {
      name: 'Kelola Pengurus',
      href: '/admin/pengurus',
      icon: UserCheck,
      current: pathname.startsWith('/admin/pengurus')
    },
    {
      name: 'Berita & Konten',
      href: '/admin/berita',
      icon: Newspaper,
      current: pathname.startsWith('/admin/berita')
    },
    {
      name: 'Laporan',
      href: '/admin/laporan',
      icon: BarChart3,
      current: pathname.startsWith('/admin/laporan')
    },
    {
      name: 'Data Master',
      href: '/admin/master-data',
      icon: Database,
      current: pathname.startsWith('/admin/master-data')
    },
    {
      name: 'Pengaturan Situs',
      href: '/admin/pengaturan',
      icon: Globe,
      current: pathname.startsWith('/admin/pengaturan')
    },
    {
      name: 'Pengaturan',
      href: '/admin/settings',
      icon: Settings,
      current: pathname.startsWith('/admin/settings')
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pgri-red"></div>
      </div>
    )
  }

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sesi Anda berakhir</h2>
          <p className="text-gray-600 mb-4">Silakan login kembali untuk mengakses halaman admin.</p>
          <Link href="/login" className="bg-pgri-red text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Ke Halaman Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <img 
              src="/images/logo-pgri.svg" 
              alt="Logo PGRI" 
              className="h-8 w-8"
            />
            <span className="ml-2 text-xl font-bold text-gray-900">Admin PGRI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <X className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? 'bg-pgri-red text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 ${item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Admin Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-pgri-red rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {adminData.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {adminData.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {adminData.email}
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center text-gray-400 hover:text-gray-600"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    href="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="mr-3 h-4 w-4" />
                    Profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-40">
          <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="relative flex flex-1 items-center">
                <h1 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => item.current)?.name || 'Dashboard Admin'}
                </h1>
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Notifications */}
                <button
                  type="button"
                  className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="-m-1.5 flex items-center p-1.5"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 bg-pgri-red rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {adminData.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:flex lg:items-center">
                      <span className="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                        {adminData.name}
                      </span>
                      <ChevronDown className="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5">
                      <Link
                        href="/admin/profile"
                        className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}