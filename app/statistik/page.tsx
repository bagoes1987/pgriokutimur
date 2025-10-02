'use client'

import { useEffect, useState } from 'react'
import PublicLayout from '@/components/layout/PublicLayout'
import { 
  Users, 
  GraduationCap, 
  MapPin, 
  BarChart3,
  PieChart,
  Calendar,
  School,
  Briefcase,
  UserCheck,
  Award,
  BookOpen,
  TrendingUp,
  Clock,
  CalendarDays
} from 'lucide-react'

interface Statistics {
  totalMembers: number
  totalNews: number
  totalOfficers: number
  totalKabupatenOfficers: number
  totalCabangOfficers: number
  membersByDistrict: { district: string; count: number }[]
  membersByGender: { gender: string; count: number }[]
  membersByBirthYear: { yearGroup: string; count: number }[]
  membersByJob: { job: string; count: number }[]
  membersByEducation: { education: string; count: number }[]
  membersByEmployeeStatus: { status: string; count: number }[]
  membersByEducatorCert: { hasEducatorCert: string; count: number }[]
  membersByTeachingLevel: { teachingLevel: string; count: number }[]
  registrationStats: {
    daily: number
    monthly: number
    yearly: number
    monthlyTrend: { month: string; count: number }[]
  }
}

export default function StatistikPage() {
  const [stats, setStats] = useState<Statistics>({
    totalMembers: 0,
    totalNews: 0,
    totalOfficers: 0,
    totalKabupatenOfficers: 0,
    totalCabangOfficers: 0,
    membersByDistrict: [],
    membersByGender: [],
    membersByBirthYear: [],
    membersByJob: [],
    membersByEducation: [],
    membersByEmployeeStatus: [],
    membersByEducatorCert: [],
    membersByTeachingLevel: [],
    registrationStats: {
      daily: 0,
      monthly: 0,
      yearly: 0,
      monthlyTrend: []
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      setLoading(true)
      
      // Fetch real statistics from API
      const response = await fetch('/api/public/statistics')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // If API fails, use empty data
         setStats({
           totalMembers: 0,
           totalNews: 0,
           totalOfficers: 0,
           totalKabupatenOfficers: 0,
           totalCabangOfficers: 0,
           membersByDistrict: [],
           membersByGender: [],
           membersByBirthYear: [],
           membersByJob: [],
           membersByEducation: [],
           membersByEmployeeStatus: [],
           membersByEducatorCert: [],
           membersByTeachingLevel: [],
           registrationStats: {
             daily: 0,
             monthly: 0,
             yearly: 0,
             monthlyTrend: []
           }
         })
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
      // If error occurs, use empty data
       setStats({
         totalMembers: 0,
         totalNews: 0,
         totalOfficers: 0,
         membersByDistrict: [],
         membersByGender: [],
         membersByBirthYear: [],
         membersByJob: [],
         membersByEducation: [],
         membersByEmployeeStatus: [],
         membersByEducatorCert: [],
         membersByTeachingLevel: [],
         registrationStats: {
           daily: 0,
           monthly: 0,
           yearly: 0,
           monthlyTrend: []
         }
       })
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, title, value, color }: { 
    icon: any, 
    title: string, 
    value: number | string, 
    color: string 
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )

  const ChartCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  )

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-pgri-red to-pgri-red-dark text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Statistik Keanggotaan
              </h1>
              <p className="text-lg text-red-100 max-w-2xl mx-auto">
                Data statistik dan analisis keanggotaan PGRI Kabupaten OKU Timur
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="space-y-8">
              {/* Loading Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                      <div className="ml-4 space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Loading Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-32 mb-4"></div>
                    <div className="h-64 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* 1. Total Anggota - Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={Users}
                  title="Total Anggota"
                  value={stats.totalMembers.toLocaleString()}
                  color="bg-pgri-red"
                />
                <StatCard
                  icon={Clock}
                  title="Pendaftar Hari Ini"
                  value={stats.registrationStats.daily}
                  color="bg-green-500"
                />
                <StatCard
                  icon={Calendar}
                  title="Pendaftar Bulan Ini"
                  value={stats.registrationStats.monthly}
                  color="bg-blue-500"
                />
                <StatCard
                  icon={CalendarDays}
                  title="Pendaftar Tahun Ini"
                  value={stats.registrationStats.yearly}
                  color="bg-purple-500"
                />
              </div>

              {/* Statistik Pengurus */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  icon={UserCheck}
                  title="Total Pengurus"
                  value={stats.totalOfficers.toLocaleString()}
                  color="bg-indigo-500"
                />
                <StatCard
                  icon={Award}
                  title="Pengurus Kabupaten"
                  value={stats.totalKabupatenOfficers.toLocaleString()}
                  color="bg-orange-500"
                />
                <StatCard
                  icon={School}
                  title="Pengurus Cabang"
                  value={stats.totalCabangOfficers.toLocaleString()}
                  color="bg-teal-500"
                />
              </div>

              {/* 2-10. Charts Grid - 9 Statistik Lainnya */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* 2. Anggota per Kecamatan */}
                <ChartCard title="2. Anggota per Kecamatan">
                  <div className="space-y-3">
                    {stats.membersByDistrict.slice(0, 5).map((item, index) => {
                      const percentage = stats.totalMembers > 0 ? (item.count / stats.totalMembers) * 100 : 0
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-pgri-red" />
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {item.district}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-pgri-red h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>

                {/* 3. Jenis Kelamin */}
                <ChartCard title="3. Jenis Kelamin">
                  {/* Ubah menjadi grid dua kolom agar susunannya kanan-kiri */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.membersByGender.map((item, index) => {
                      const percentage = stats.totalMembers > 0 ? (item.count / stats.totalMembers) * 100 : 0
                      const colors = ['bg-blue-500', 'bg-pink-500']
                      return (
                        <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                          <div className={`w-16 h-16 ${colors[index]} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                            <Users className="h-8 w-8 text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900">{item.gender}</h4>
                          <p className="text-2xl font-bold text-gray-900">{item.count}</p>
                          <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>

                {/* 4. Tahun Lahir */}
                <ChartCard title="4. Kelompok Tahun Lahir">
                  <div className="space-y-3">
                    {stats.membersByBirthYear.map((item, index) => {
                      const percentage = stats.totalMembers > 0 ? (item.count / stats.totalMembers) * 100 : 0
                      const colors = ['bg-purple-500', 'bg-indigo-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500']
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-purple-500" />
                            <span className="text-xs font-medium text-gray-700">
                              {item.yearGroup}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`${colors[index % colors.length]} h-2 rounded-full`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>

                {/* 5. Pekerjaan */}
                <ChartCard title="5. Pekerjaan">
                  <div className="space-y-3">
                    {stats.membersByJob.slice(0, 5).map((item, index) => {
                      const percentage = stats.totalMembers > 0 ? (item.count / stats.totalMembers) * 100 : 0
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Briefcase className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {item.job}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>

                {/* 6. Tingkat Pendidikan */}
                <ChartCard title="6. Tingkat Pendidikan">
                  <div className="space-y-3">
                    {stats.membersByEducation.map((item, index) => {
                      const percentage = stats.totalMembers > 0 ? (item.count / stats.totalMembers) * 100 : 0
                      const colors = ['bg-pgri-red', 'bg-pgri-green', 'bg-pgri-yellow-dark', 'bg-blue-500']
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <GraduationCap className="h-4 w-4 text-pgri-green" />
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {item.education}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`${colors[index % colors.length]} h-2 rounded-full`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>

                {/* 7. Status Pegawai */}
                <ChartCard title="7. Status Pegawai">
                  <div className="space-y-3">
                    {stats.membersByEmployeeStatus.map((item, index) => {
                      const percentage = stats.totalMembers > 0 ? (item.count / stats.totalMembers) * 100 : 0
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <UserCheck className="h-4 w-4 text-orange-500" />
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {item.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-orange-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>

                {/* 8. Sertifikat Pendidik */}
                <ChartCard title="8. Sertifikat Pendidik">
                  <div className="space-y-4">
                    {stats.membersByEducatorCert.map((item, index) => {
                      const percentage = stats.totalMembers > 0 ? (item.count / stats.totalMembers) * 100 : 0
                      const colors = ['bg-green-500', 'bg-red-500']
                      return (
                        <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                          <div className={`w-12 h-12 ${colors[index]} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-gray-900 text-sm">{item.hasEducatorCert}</h4>
                          <p className="text-xl font-bold text-gray-900">{item.count}</p>
                          <p className="text-xs text-gray-600">{percentage.toFixed(1)}%</p>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>

                {/* 9. Jenjang Mengajar */}
                <ChartCard title="9. Jenjang Mengajar">
                  <div className="space-y-3">
                    {stats.membersByTeachingLevel.slice(0, 5).map((item, index) => {
                      const percentage = stats.totalMembers > 0 ? (item.count / stats.totalMembers) * 100 : 0
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-indigo-500" />
                            <span className="text-xs font-medium text-gray-700 truncate">
                              {item.teachingLevel}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-indigo-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>

                {/* 10. Trend Pendaftaran Bulanan */}
                <ChartCard title="10. Trend Pendaftaran (12 Bulan)">
                  <div className="space-y-2">
                    {/* Tampilkan 6 bulan terakhir dengan bulan terbaru di atas */}
                    {stats.registrationStats.monthlyTrend.slice(-6).reverse().map((item, index) => {
                      const maxCount = Math.max(...stats.registrationStats.monthlyTrend.map(m => m.count))
                      const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-purple-500" />
                            <span className="text-xs font-medium text-gray-700">
                              {item.month}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-semibold text-gray-900 w-8 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ChartCard>
              </div>

              {/* Summary Section */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Ringkasan Statistik Keanggotaan</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <Users className="h-8 w-8 text-pgri-red mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Total Anggota</h4>
                    <p className="text-2xl font-bold text-pgri-red">{stats.totalMembers.toLocaleString()}</p>
                    <p className="text-sm text-gray-600 mt-1">Anggota aktif terdaftar</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Kecamatan Terbanyak</h4>
                    <p className="text-lg font-bold text-green-600">
                      {stats.membersByDistrict[0]?.district || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.membersByDistrict[0]?.count || 0} anggota
                    </p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Pendidikan Dominan</h4>
                    <p className="text-lg font-bold text-blue-600">
                      {stats.membersByEducation[0]?.education || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {stats.membersByEducation[0]?.count || 0} anggota
                    </p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Pendaftar Bulan Ini</h4>
                    <p className="text-2xl font-bold text-purple-600">{stats.registrationStats.monthly}</p>
                    <p className="text-sm text-gray-600 mt-1">Anggota baru</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}