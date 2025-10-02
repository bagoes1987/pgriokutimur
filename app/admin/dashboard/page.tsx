'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { 
  Users,
  UserCheck,
  UserX,
  Clock,
  Newspaper,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Target,
  Award
} from 'lucide-react'

interface DashboardStats {
  totalMembers: number
  approvedMembers: number
  pendingMembers: number
  rejectedMembers: number
  totalNews: number
  publishedNews: number
  totalOfficers: number
  totalKabupatenOfficers: number
  totalCabangOfficers: number
  totalViews: number
  monthlyRegistrations: Array<{
    month: string
    count: number
  }>
  membersByProvince: Array<{
    province: string
    count: number
  }>
  recentActivities: Array<{
    id: number
    type: string
    description: string
    timestamp: string
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      // Add cache busting to ensure fresh data
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/admin/dashboard?t=${timestamp}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      const data = await response.json()
      console.log('Dashboard stats fetched:', data) // Debug log
      // Extract stats from the response structure
      setStats(data.stats || data)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      toast.error('Gagal memuat data dashboard')
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-8">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
        
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
    </div>
  )

  if (loading) {
    return (
      <AdminLayout>
        <LoadingSkeleton />
      </AdminLayout>
    )
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Tidak Tersedia</h3>
            <p className="text-gray-600 mb-4">Gagal memuat data dashboard. Silakan coba lagi.</p>
            <button
              onClick={fetchDashboardStats}
              className="bg-pgri-red text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
          {/* Enhanced Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pgri-red/10 to-blue-600/10 rounded-2xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-pgri-red to-red-700 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Dashboard Admin
                    </h1>
                  </div>
                  <p className="text-gray-600 text-lg">
                    Selamat datang di Portal Resmi PGRI Kabupaten OKU Timur
                  </p>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <button
                    onClick={fetchDashboardStats}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-pgri-red text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Activity className="h-4 w-4" />
                    <span>{loading ? 'Memuat...' : 'Refresh'}</span>
                  </button>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Anggota</p>
                    <p className="text-2xl font-bold text-pgri-red">{formatNumber(stats?.totalMembers || 0)}</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Total Members */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Anggota</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(stats?.totalMembers || 0)}</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">Aktif</span>
              </div>
            </div>

            {/* Total Pengurus */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Pengurus</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(stats?.totalOfficers || 0)}</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCheck className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Target className="h-4 w-4 text-indigo-500 mr-1" />
                  <span className="text-indigo-600 font-medium">Aktif</span>
                </div>
                <div className="text-xs text-gray-500">
                  Kab: {formatNumber(stats?.totalKabupatenOfficers || 0)} | Cab: {formatNumber(stats?.totalCabangOfficers || 0)}
                </div>
              </div>
            </div>

            {/* Total News */}
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Berita</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(stats?.totalNews || 0)}</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Newspaper className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-purple-600 font-medium">{formatNumber(stats?.publishedNews || 0)}</span>
                <span className="text-gray-500 ml-1">dipublikasikan</span>
              </div>
            </div>
          </div>

          {/* Enhanced Charts and Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Registrations Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Pendaftaran Bulanan</h3>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="space-y-4">
                {(stats?.monthlyRegistrations || []).map((item, index) => (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.month}</span>
                      <span className="text-sm font-bold text-gray-900">{item.count} anggota</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-pgri-red to-red-600 h-3 rounded-full transition-all duration-1000 ease-out group-hover:from-blue-500 group-hover:to-blue-600" 
                        style={{ 
                          width: `${Math.max(5, (item.count / Math.max(...(stats?.monthlyRegistrations || []).map(r => r.count), 1)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Aktivitas Terbaru</h3>
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                  <Activity className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {(stats?.recentActivities || []).slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                      activity.type === 'registration' ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
              {(stats?.recentActivities || []).length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Belum ada aktivitas terbaru</p>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Members by Province */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Anggota per Provinsi</h3>
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <PieChart className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(stats?.membersByProvince || []).slice(0, 6).map((item, index) => (
                <div key={index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:scale-105">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-900">{item.province}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">{formatNumber(item.count)}</span>
                    <span className="text-xs text-gray-500 group-hover:text-blue-500">anggota</span>
                  </div>
                </div>
              ))}
            </div>
            {(stats?.membersByProvince || []).length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PieChart className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">Belum ada data anggota</p>
              </div>
            )}
          </div>

          {/* Enhanced Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Aksi Cepat</h3>
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/admin/anggota"
                className="group flex items-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-blue-900 group-hover:text-blue-800">Kelola Anggota</p>
                  <p className="text-sm text-blue-600 group-hover:text-blue-700">Lihat semua anggota</p>
                </div>
              </a>
              
              <a
                href="/admin/berita"
                className="group flex items-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Newspaper className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-green-900 group-hover:text-green-800">Kelola Berita</p>
                  <p className="text-sm text-green-600 group-hover:text-green-700">Buat berita baru</p>
                </div>
              </a>
              
              {(stats?.pendingMembers || 0) > 0 && (
                <a
                  href="/admin/persetujuan"
                  className="group flex items-center p-6 bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl hover:from-yellow-100 hover:to-orange-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  <div className="h-12 w-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-yellow-900 group-hover:text-yellow-800">Persetujuan</p>
                    <p className="text-sm text-yellow-600 group-hover:text-yellow-700">{stats?.pendingMembers || 0} menunggu</p>
                  </div>
                </a>
              )}
              
              <a
                href="/admin/laporan"
                className="group flex items-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-purple-900 group-hover:text-purple-800">Laporan</p>
                  <p className="text-sm text-purple-600 group-hover:text-purple-700">Lihat statistik</p>
                </div>
              </a>
            </div>
          </div>
      </div>
    </AdminLayout>
  )
}