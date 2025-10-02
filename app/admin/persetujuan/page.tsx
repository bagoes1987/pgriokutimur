'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { 
  UserCheck,
  UserX,
  Clock,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface Member {
  id: string
  name: string
  email: string
  phone: string
  nip: string
  nuptk: string
  birthPlace: string
  birthDate: string
  address: string
  province: string
  city: string
  district: string
  village: string
  postalCode: string
  school: string
  position: string
  workUnit: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export default function PersetujuanPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('pending')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchMembers()
  }, [currentPage, searchTerm, statusFilter])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      
      const response = await fetch(`/api/admin/members?${params}`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data.members || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        toast.error('Gagal memuat data anggota')
      }
    } catch (error) {
      console.error('Error fetching members:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (memberId: string, status: 'approved' | 'rejected') => {
    try {
      setProcessingId(memberId)
      const response = await fetch(`/api/admin/members/${memberId}/approval`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        toast.success(`Anggota berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}`)
        fetchMembers()
        setShowDetailModal(false)
      } else {
        const data = await response.json()
        toast.error(data.message || 'Gagal memproses persetujuan')
      }
    } catch (error) {
      console.error('Error processing approval:', error)
      toast.error('Terjadi kesalahan saat memproses persetujuan')
    } finally {
      setProcessingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disetujui
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Ditolak
          </span>
        )
      default:
        return null
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Persetujuan Anggota</h1>
          <p className="text-gray-600">Kelola persetujuan pendaftaran anggota baru</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Cari nama, email, atau NIP..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
              >
                <option value="pending">Menunggu Persetujuan</option>
                <option value="approved">Disetujui</option>
                <option value="rejected">Ditolak</option>
                <option value="all">Semua Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                    </div>
                    <div className="h-8 w-20 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : members.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Anggota
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kontak
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sekolah
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tanggal Daftar
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-sm text-gray-500">NIP: {member.nip}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.email}</div>
                          <div className="text-sm text-gray-500">{member.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{member.school}</div>
                          <div className="text-sm text-gray-500">{member.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(member.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(member.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => {
                                setSelectedMember(member)
                                setShowDetailModal(true)
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Lihat Detail"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {member.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApproval(member.id, 'approved')}
                                  disabled={processingId === member.id}
                                  className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                                  title="Setujui"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleApproval(member.id, 'rejected')}
                                  disabled={processingId === member.id}
                                  className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                  title="Tolak"
                                >
                                  <UserX className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Sebelumnya
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Selanjutnya
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Halaman <span className="font-medium">{currentPage}</span> dari{' '}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Sebelumnya
                          </button>
                          <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Selanjutnya
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
              <p className="mt-1 text-sm text-gray-500">
                Tidak ada anggota dengan status {statusFilter === 'all' ? 'apapun' : statusFilter}.
              </p>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedMember && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Detail Anggota</h3>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Informasi Pribadi</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedMember.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedMember.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Telepon</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedMember.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tempat, Tanggal Lahir</label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.birthPlace}, {formatDate(selectedMember.birthDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Info */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Informasi Kepegawaian</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">NIP</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedMember.nip}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">NUPTK</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedMember.nuptk}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Sekolah</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedMember.school}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Jabatan</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedMember.position}</p>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Alamat</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-900">{selectedMember.address}</p>
                      <p className="text-sm text-gray-600">
                        {selectedMember.village}, {selectedMember.district}, {selectedMember.city}, {selectedMember.province} {selectedMember.postalCode}
                      </p>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Status: </span>
                      {getStatusBadge(selectedMember.status)}
                    </div>
                    {selectedMember.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApproval(selectedMember.id, 'rejected')}
                          disabled={processingId === selectedMember.id}
                          className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Tolak
                        </button>
                        <button
                          onClick={() => handleApproval(selectedMember.id, 'approved')}
                          disabled={processingId === selectedMember.id}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Setujui
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}