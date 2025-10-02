'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { 
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Download,
  Calendar,
  Filter,
  PieChart,
  Activity,
  MapPin,
  School,
  UserCheck,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Statistics {
  totalMembers: number
  pendingApprovals: number
  approvedMembers: number
  rejectedMembers: number
  totalNews: number
  publishedNews: number
  draftNews: number
  membersByProvince: { province: string; count: number }[]
  membersByPosition: { position: string; count: number }[]
  memberRegistrationTrend: { month: string; count: number }[]
  newsPublishingTrend: { month: string; count: number }[]
}

export default function LaporanPage() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    endDate: new Date().toISOString().split('T')[0] // Today
  })
  const [reportType, setReportType] = useState('overview')
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    fetchStatistics()
  }, [dateRange])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      })
      
      const response = await fetch(`/api/admin/statistics?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStatistics(data)
      } else {
        toast.error('Gagal memuat data statistik')
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = async (format: 'pdf' | 'excel') => {
    try {
      setExportLoading(true)
      const params = new URLSearchParams({
        type: reportType,
        format,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      })
      
      const response = await fetch(`/api/admin/reports/export?${params}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = `laporan-${reportType}-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        toast.success('Laporan berhasil diunduh')
      } else {
        toast.error('Gagal mengunduh laporan')
      }
    } catch (error) {
      console.error('Error exporting report:', error)
      toast.error('Terjadi kesalahan saat mengunduh laporan')
    } finally {
      setExportLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }: {
    title: string
    value: number
    icon: any
    color: string
    trend?: { value: number; isPositive: boolean }
  }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
          {trend && (
            <div className={`flex items-center mt-1 text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`h-4 w-4 mr-1 ${trend.isPositive ? '' : 'rotate-180'}`} />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Laporan & Statistik</h1>
          <p className="text-gray-600">Analisis data dan laporan sistem</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Date Range */}
            <div className="flex items-center gap-4">
              <Calendar className="text-gray-400 h-5 w-5" />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                />
                <span className="text-gray-500">sampai</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Report Type */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
              >
                <option value="overview">Ringkasan</option>
                <option value="members">Laporan Anggota</option>
                <option value="news">Laporan Berita</option>
                <option value="geographic">Laporan Geografis</option>
              </select>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => handleExportReport('pdf')}
                disabled={exportLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                disabled={exportLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-pgri-red hover:bg-red-700 disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Excel
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {/* Loading skeleton for stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-gray-300 rounded-lg"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Loading skeleton for charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : statistics ? (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Anggota"
                value={statistics.totalMembers}
                icon={Users}
                color="bg-blue-500"
              />
              <StatCard
                title="Menunggu Persetujuan"
                value={statistics.pendingApprovals}
                icon={Clock}
                color="bg-yellow-500"
              />
              <StatCard
                title="Anggota Disetujui"
                value={statistics.approvedMembers}
                icon={UserCheck}
                color="bg-green-500"
              />
              <StatCard
                title="Total Berita"
                value={statistics.totalNews}
                icon={FileText}
                color="bg-purple-500"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Member Registration Trend */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Tren Pendaftaran Anggota</h3>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {statistics.memberRegistrationTrend.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{
                          height: `${Math.max((item.count / Math.max(...statistics.memberRegistrationTrend.map(i => i.count))) * 200, 4)}px`
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                      <span className="text-xs font-medium text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Members by Province */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Anggota per Provinsi</h3>
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {statistics.membersByProvince.slice(0, 8).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 truncate">{item.province}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${(item.count / Math.max(...statistics.membersByProvince.map(i => i.count))) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Members by Position */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Anggota per Jabatan</h3>
                  <School className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {statistics.membersByPosition.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.position}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{
                              width: `${(item.count / Math.max(...statistics.membersByPosition.map(i => i.count))) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* News Publishing Trend */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Tren Publikasi Berita</h3>
                  <Activity className="h-5 w-5 text-gray-400" />
                </div>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {statistics.newsPublishingTrend.map((item, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="w-full bg-purple-500 rounded-t"
                        style={{
                          height: `${Math.max((item.count / Math.max(...statistics.newsPublishingTrend.map(i => i.count))) * 200, 4)}px`
                        }}
                      ></div>
                      <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                      <span className="text-xs font-medium text-gray-900">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Ringkasan Data</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kategori
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Persentase
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Anggota Disetujui
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(statistics.approvedMembers)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {statistics.totalMembers > 0 ? ((statistics.approvedMembers / statistics.totalMembers) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Menunggu Persetujuan
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(statistics.pendingApprovals)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {statistics.totalMembers > 0 ? ((statistics.pendingApprovals / statistics.totalMembers) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Berita Dipublikasi
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(statistics.publishedNews)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {statistics.totalNews > 0 ? ((statistics.publishedNews / statistics.totalNews) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Draft Berita
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatNumber(statistics.draftNews)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {statistics.totalNews > 0 ? ((statistics.draftNews / statistics.totalNews) * 100).toFixed(1) : 0}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tidak dapat memuat data statistik. Silakan coba lagi.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}