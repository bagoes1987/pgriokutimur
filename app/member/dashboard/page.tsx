'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MemberLayout from '@/components/layout/MemberLayout'
import { 
  User,
  CreditCard,
  FileText,
  CheckCircle,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Bell,
  Star,
  Activity,
  Clock,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  Sparkles,
  Newspaper,
  Calendar
} from 'lucide-react'

interface MemberData {
  id: number
  email: string
  oldNpa?: string
  npa: string
  nik: string
  name: string
  birthPlace: string
  birthDate: string
  gender: string
  bloodType?: string
  address: string
  postalCode: string
  phoneNumber: string
  photo?: string
  institutionName: string
  workAddress: string
  rank?: string
  hasEducatorCert: boolean
  subjects?: string
  status: string
  createdAt: string
  updatedAt: string
  religion: { name: string }
  province: { name: string }
  regency: { name: string }
  district: { name: string }
  village?: { name: string }
  job: { name: string }
  education: { name: string }
  employeeStatus: { name: string }
  teachingLevels: Array<{
    name: string
  }>
}

interface DashboardStats {
  totalMembers: number
  totalEvents: number
  totalNews: number
  memberSince: string
}

export default function MemberDashboard() {
  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [photoTimestamp, setPhotoTimestamp] = useState<number>(() => {
    // Initialize from localStorage if available, otherwise use current time
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('memberPhotoTimestamp')
      if (saved) {
        console.log('🚀 DASHBOARD INIT: Using saved timestamp from localStorage:', saved)
        return parseInt(saved)
      }
    }
    const newTimestamp = Date.now()
    console.log('🚀 DASHBOARD INIT: Using new timestamp:', newTimestamp)
    return newTimestamp
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Listen for photo updates from other pages
  useEffect(() => {
    const handlePhotoUpdate = () => {
      const savedTimestamp = localStorage.getItem('memberPhotoTimestamp')
      if (savedTimestamp) {
        const timestamp = parseInt(savedTimestamp)
        setPhotoTimestamp(timestamp)
        console.log('📸 DASHBOARD: Photo timestamp updated from localStorage:', timestamp)
      }
    }

    // Check on mount
    handlePhotoUpdate()

    // Listen for storage changes
    window.addEventListener('storage', handlePhotoUpdate)
    
    // Listen for custom photo update events
    window.addEventListener('photoUpdated', handlePhotoUpdate)

    return () => {
      window.removeEventListener('storage', handlePhotoUpdate)
      window.removeEventListener('photoUpdated', handlePhotoUpdate)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/member/dashboard')
      if (response.ok) {
        const data = await response.json()
        console.log('Dashboard: Received member data:', data.member)
        console.log('Dashboard: Photo:', data.member?.photo)
        setMemberData(data.member)
        setError(null)
      } else {
        console.log('Dashboard: API failed, using fallback data')
        // Set fallback data jika API gagal
        setMemberData({
          id: 1,
          name: 'Anggota PGRI',
          email: 'anggota@pgri.id',
          npa: '123456789',
          nik: '1234567890123456',
          phone: '081234567890',
          joinDate: new Date().toISOString(),
          institutionName: 'Sekolah Dasar Negeri 1'
        })
        setError('Menggunakan data demo - silakan login untuk data sebenarnya')
      }
      
      // Set stats data
      setStats({
        totalMembers: 1250,
        totalEvents: 45,
        totalNews: 128,
        memberSince: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set fallback data jika terjadi error
      setMemberData({
        id: 1,
        name: 'Anggota PGRI',
        email: 'anggota@pgri.id',
        npa: '123456789',
        nik: '1234567890123456',
        phone: '081234567890',
        joinDate: new Date().toISOString(),
        institutionName: 'Sekolah Dasar Negeri 1'
      })
      setStats({
        totalMembers: 1250,
        totalEvents: 45,
        totalNews: 128,
        memberSince: new Date().toISOString()
      })
      setError('Menggunakan data demo - silakan login untuk data sebenarnya')
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      name: 'Biodata Saya',
      href: '/member/biodata',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      description: 'Kelola informasi pribadi Anda',
      bgPattern: 'bg-blue-50'
    },
    {
      name: 'Kartu Anggota',
      href: '/member/kartu-anggota',
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      description: 'Download dan lihat kartu anggota',
      bgPattern: 'bg-green-50'
    },
    {
      name: 'Berita PGRI',
      href: '/member/berita',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      description: 'Baca berita dan informasi terbaru',
      bgPattern: 'bg-purple-50'
    },
    {
      name: 'Kegiatan',
      href: '/member/kegiatan',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      description: 'Lihat kegiatan dan acara PGRI',
      bgPattern: 'bg-orange-50'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'Pendaftaran berhasil diverifikasi',
      date: new Date().toISOString(),
      status: 'completed'
    },
    {
      id: 2,
      title: 'Kartu anggota telah diterbitkan',
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed'
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Rapat Koordinasi Pengurus',
      date: new Date(Date.now() + 7 * 86400000).toISOString(),
      location: 'Kantor PGRI OKU Timur',
      type: 'Rapat'
    },
    {
      id: 2,
      title: 'Pelatihan Guru Profesional',
      date: new Date(Date.now() + 14 * 86400000).toISOString(),
      location: 'Aula PGRI',
      type: 'Pelatihan'
    }
  ]



  if (loading) {
    console.log('Dashboard is loading...')
    return (
      <MemberLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pgri-red"></div>
        </div>
      </MemberLayout>
    )
  }

  console.log('Dashboard rendering with data:', { memberData, stats, error })

  return (
    <MemberLayout>
      <div className="space-y-4">
        {/* Error Notification */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Bell className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pgri-red/10 to-blue-600/10 rounded-2xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-pgri-red to-red-700 rounded-lg flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      Selamat Datang, {memberData?.name || 'Anggota PGRI'}!
                    </h1>
                    <p className="text-gray-600 text-xs lg:text-sm">
                      PGRI Kabupaten OKU Timur
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Kelola informasi keanggotaan dan akses berbagai layanan PGRI OKU Timur
                </p>
              </div>
              <div className="flex items-center space-x-3 self-end mr-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Status Anggota</p>
                  <p className="text-lg font-bold text-green-600">Aktif</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profil Anggota */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Profil Anggota</h2>
            <div className="p-1.5 bg-red-500 rounded-lg">
              <User className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Foto Profil */}
            <div className="flex-shrink-0">
              {memberData?.photo ? (
                <div className="relative">
                  <img 
                    src={`${memberData.photo}?t=${photoTimestamp}&id=${memberData.id}`}
                    alt="Foto Profil"
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-red-500/20"
                    style={{ objectPosition: 'center top' }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-red-500/20">
                    <User className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Informasi Profil */}
            <div className="flex-1 min-w-0">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                  {memberData?.name || 'Bagus Panca Wiratama, S.Pd., M.Pd.'}
                </h3>
                <p className="text-sm text-gray-600">NPA: {memberData?.npa || memberData?.oldNpa || '-'}</p>
                <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Anggota Aktif
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Informasi Personal */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Informasi Personal</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Nama Lengkap</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {memberData?.name || 'Bagus Panca Wiratama, S.Pd., M.Pd.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                        <Mail className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {memberData?.email || 'baguspancawiratama@gmail.com'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                        <Phone className="h-3 w-3 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">No. Telepon</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.phoneNumber || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
                        <CreditCard className="h-3 w-3 text-orange-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">NIK</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.nik || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Tempat, Tanggal Lahir</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.birthPlace ? `${memberData.birthPlace}, ${new Date(memberData.birthDate).toLocaleDateString('id-ID')}` : '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center">
                        <User className="h-3 w-3 text-pink-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Jenis Kelamin</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.gender || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center">
                        <Heart className="h-3 w-3 text-yellow-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Agama</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.religion?.name || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-red-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Alamat</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.address || '-'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informasi Keanggotaan & Pekerjaan */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Informasi Keanggotaan</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-red-100 rounded flex items-center justify-center">
                        <Shield className="h-3 w-3 text-red-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">NPA</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.npa || memberData?.oldNpa || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-yellow-100 rounded flex items-center justify-center">
                        <Briefcase className="h-3 w-3 text-yellow-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Instansi</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.institutionName || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center">
                        <MapPin className="h-3 w-3 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Wilayah</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.regency?.name || 'OKU Timur'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                        <Briefcase className="h-3 w-3 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Pekerjaan</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.job?.name || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                        <User className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Status Kepegawaian</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.employeeStatus?.name || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
                        <GraduationCap className="h-3 w-3 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500">Pendidikan</p>
                        <p className="text-sm font-medium text-gray-900">
                          {memberData?.education?.name || '-'}
                        </p>
                      </div>
                    </div>


                  </div>
                </div>
              </div>

              {/* Status dan Tombol */}
              <div className="mt-4 pt-3 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Status: Aktif</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Terverifikasi</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link href="/member/biodata">
                    <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">
                      <User className="h-3 w-3 mr-1" />
                      Edit Profil
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  )
}