'use client'

import { useState, useEffect } from 'react'
import MemberLayout from '@/components/layout/MemberLayout'
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  ChevronRight,
  Star,
  CheckCircle,
  AlertCircle,
  User,
  Award,
  TrendingUp
} from 'lucide-react'

interface Activity {
  id: number
  title: string
  description: string
  startDate: string
  endDate: string
  location: string
  type: string
  status: 'upcoming' | 'ongoing' | 'completed'
  maxParticipants?: number
  currentParticipants: number
  organizer: string
  imageUrl?: string
  featured: boolean
  registrationDeadline?: string
}

export default function KegiatanPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      // Mock data for now
      const mockActivities: Activity[] = [
        {
          id: 1,
          title: 'Workshop Teknologi Pembelajaran Digital',
          description: 'Pelatihan penggunaan teknologi digital dalam pembelajaran untuk meningkatkan kualitas pendidikan.',
          startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 9 * 86400000).toISOString(),
          location: 'Aula PGRI OKU Timur',
          type: 'Workshop',
          status: 'upcoming',
          maxParticipants: 100,
          currentParticipants: 75,
          organizer: 'PGRI OKU Timur',
          imageUrl: '/images/workshop.jpg',
          featured: true,
          registrationDeadline: new Date(Date.now() + 5 * 86400000).toISOString()
        },
        {
          id: 2,
          title: 'Rapat Koordinasi Pengurus',
          description: 'Rapat koordinasi bulanan pengurus PGRI untuk membahas program kerja dan evaluasi kegiatan.',
          startDate: new Date(Date.now() + 3 * 86400000).toISOString(),
          endDate: new Date(Date.now() + 3 * 86400000).toISOString(),
          location: 'Kantor PGRI OKU Timur',
          type: 'Rapat',
          status: 'upcoming',
          currentParticipants: 25,
          organizer: 'Pengurus PGRI',
          featured: false
        },
        {
          id: 3,
          title: 'Seminar Pendidikan Karakter',
          description: 'Seminar nasional tentang pentingnya pendidikan karakter dalam membentuk generasi bangsa.',
          startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
          endDate: new Date(Date.now() - 1 * 86400000).toISOString(),
          location: 'Gedung Serbaguna',
          type: 'Seminar',
          status: 'completed',
          maxParticipants: 200,
          currentParticipants: 180,
          organizer: 'PGRI Pusat',
          imageUrl: '/images/seminar.jpg',
          featured: true
        },
        {
          id: 4,
          title: 'Pelatihan Manajemen Kelas',
          description: 'Pelatihan praktis tentang manajemen kelas yang efektif untuk meningkatkan hasil pembelajaran.',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 86400000).toISOString(),
          location: 'Online via Zoom',
          type: 'Pelatihan',
          status: 'ongoing',
          maxParticipants: 150,
          currentParticipants: 120,
          organizer: 'PGRI OKU Timur',
          featured: false
        }
      ]
      
      setActivities(mockActivities)
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const activityTypes = ['all', 'Workshop', 'Seminar', 'Pelatihan', 'Rapat', 'Webinar']
  const statusOptions = ['all', 'upcoming', 'ongoing', 'completed']

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || activity.type === selectedType
    const matchesStatus = selectedStatus === 'all' || activity.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const featuredActivities = activities.filter(activity => activity.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            Akan Datang
          </span>
        )
      case 'ongoing':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Sedang Berlangsung
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Selesai
          </span>
        )
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Akan Datang'
      case 'ongoing': return 'Sedang Berlangsung'
      case 'completed': return 'Selesai'
      default: return 'Semua Status'
    }
  }

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        </div>
      </MemberLayout>
    )
  }

  return (
    <MemberLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-8 text-white">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Kegiatan PGRI</h1>
              <p className="text-green-100">Ikuti berbagai kegiatan dan program pengembangan profesional</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-green-200" />
                <div>
                  <p className="text-2xl font-bold">{activities.filter(a => a.status === 'upcoming').length}</p>
                  <p className="text-green-200 text-sm">Kegiatan Mendatang</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-green-200" />
                <div>
                  <p className="text-2xl font-bold">{activities.reduce((sum, a) => sum + a.currentParticipants, 0)}</p>
                  <p className="text-green-200 text-sm">Total Peserta</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-green-200" />
                <div>
                  <p className="text-2xl font-bold">{activities.filter(a => a.status === 'completed').length}</p>
                  <p className="text-green-200 text-sm">Kegiatan Selesai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kegiatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  {activityTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'Semua Jenis' : type}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {getStatusText(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Activities */}
        {featuredActivities.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900">Kegiatan Unggulan</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {featuredActivities.slice(0, 2).map((activity) => (
                <div key={activity.id} className="group cursor-pointer">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {activity.imageUrl ? (
                      <img 
                        src={activity.imageUrl} 
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                        <Calendar className="h-12 w-12 text-green-500" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        {activity.type}
                      </span>
                      {getStatusBadge(activity.status)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {activity.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(activity.startDate)}</span>
                        {activity.startDate !== activity.endDate && (
                          <span>- {formatDate(activity.endDate)}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>
                          {activity.currentParticipants} peserta
                          {activity.maxParticipants && ` / ${activity.maxParticipants} maks`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Activities */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Semua Kegiatan</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                    {activity.imageUrl ? (
                      <img 
                        src={activity.imageUrl} 
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Calendar className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {activity.type}
                        </span>
                        {getStatusBadge(activity.status)}
                        {activity.featured && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-yellow-600 text-xs">Unggulan</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {activity.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(activity.startDate)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4" />
                        <span>{activity.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {activity.currentParticipants} peserta
                          {activity.maxParticipants && ` / ${activity.maxParticipants}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Penyelenggara: {activity.organizer}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada kegiatan ditemukan</h3>
            <p className="text-gray-500">Coba ubah kata kunci pencarian atau filter</p>
          </div>
        )}
      </div>
    </MemberLayout>
  )
}