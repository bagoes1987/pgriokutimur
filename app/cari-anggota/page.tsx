'use client'

import { useState, useEffect } from 'react'
import PublicLayout from '@/components/layout/PublicLayout'
import { Search, User, MapPin, Phone, Mail, Users } from 'lucide-react'

interface Member {
  id: number
  name: string
  npa?: string
  email?: string
  phone?: string
  gender?: string
  birthPlace?: string
  birthDate?: string
  address?: string
  province?: string
  regency?: string
  district?: string
  village?: string
  job?: string
  education?: string
  employeeStatus?: string
  workplace?: string
  workAddress?: string
  subjects?: string
  joinDate?: string
  status: 'active' | 'inactive'
}

interface District {
  id: number
  name: string
  fullName: string
}

export default function CariAnggotaPage() {
  const [searchNama, setSearchNama] = useState('')
  const [selectedDistrictId, setSelectedDistrictId] = useState('')
  const [districts, setDistricts] = useState<District[]>([])
  const [searchResults, setSearchResults] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  // Fetch districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch('/api/public/districts')
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setDistricts(data.districts || [])
          }
        }
      } catch (error) {
        console.error('Error fetching districts:', error)
      }
    }

    fetchDistricts()
  }, [])

  const handleSearch = async (e?: React.FormEvent, page: number = 1) => {
    if (e) e.preventDefault()
    
    // Allow search even if both fields are empty to show all members
    setLoading(true)
    setHasSearched(true)
    setCurrentPage(page)

    try {
      const params = new URLSearchParams()
      if (searchNama.trim()) params.append('searchNama', searchNama.trim())
      if (selectedDistrictId) params.append('districtId', selectedDistrictId)
      params.append('page', page.toString())
      params.append('limit', '10')

      const response = await fetch(`/api/public/members/search?${params}`)
      const data = await response.json()

      if (data.success) {
        setSearchResults(data.data.members)
        setTotalPages(data.data.pagination.totalPages)
        setTotalCount(data.data.pagination.totalCount)
      } else {
        setSearchResults([])
        setTotalPages(0)
        setTotalCount(0)
      }
    } catch (error) {
      console.error('Error searching members:', error)
      setSearchResults([])
      setTotalPages(0)
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    handleSearch(undefined, page)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-pgri-red to-pgri-red-dark text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Cari Data Anggota
              </h1>
              <p className="text-lg text-red-100 max-w-2xl mx-auto">
                Temukan informasi anggota PGRI Kabupaten OKU Timur dengan mudah dan cepat
              </p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Fields Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari berdasarkan Nama
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchNama}
                      onChange={(e) => setSearchNama(e.target.value)}
                      placeholder="Masukkan nama anggota..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cari berdasarkan Kecamatan
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={selectedDistrictId}
                      onChange={(e) => setSelectedDistrictId(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Semua Kecamatan</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-pgri-red text-white rounded-lg hover:bg-pgri-red-dark focus:ring-2 focus:ring-pgri-red focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Mencari...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Search className="h-5 w-5 mr-2" />
                      Cari Anggota
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-600">
                      Ditemukan {totalCount} anggota (Halaman {currentPage} dari {totalPages})
                    </div>
                  </div>
                  <div className="space-y-4">
                    {searchResults.map((member) => (
                      <div key={member.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-pgri-red to-pgri-red-dark rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-bold text-gray-900">
                                {member.name}
                              </h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                member.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {member.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                              {member.npa && (
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>NPA: {member.npa}</span>
                                </div>
                              )}
                              {member.gender && (
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>{member.gender}</span>
                                </div>
                              )}
                              {member.job && (
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>{member.job}</span>
                                </div>
                              )}
                              {member.education && (
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>{member.education}</span>
                                </div>
                              )}
                              {member.workplace && (
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>{member.workplace}</span>
                                </div>
                              )}
                              {member.subjects && (
                                <div className="flex items-center">
                                  <Users className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>Mata Pelajaran: {member.subjects}</span>
                                </div>
                              )}
                              {member.phone && (
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>{member.phone}</span>
                                </div>
                              )}
                              {member.email && (
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>{member.email}</span>
                                </div>
                              )}
                              {(member.district || member.village) && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>{member.village ? `${member.village}, ` : ''}{member.district}</span>
                                </div>
                              )}

                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sebelumnya
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 2 && page <= currentPage + 2)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                currentPage === page
                                  ? 'text-white bg-pgri-red border border-pgri-red'
                                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        } else if (
                          page === currentPage - 3 ||
                          page === currentPage + 3
                        ) {
                          return (
                            <span key={page} className="px-2 py-2 text-sm text-gray-500">
                              ...
                            </span>
                          )
                        }
                        return null
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Selanjutnya
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Tidak Ada Hasil
                  </h3>
                  <p className="text-gray-500">
                    Tidak ditemukan anggota dengan kriteria pencarian yang diberikan.
                    Coba gunakan kata kunci yang berbeda atau kosongkan filter untuk melihat semua anggota.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Search Tips */}
          {!hasSearched && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-3">
                Tips Pencarian:
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• Gunakan sebagian nama, atau nama lengkap serta pilihan kecamatan untuk hasil yang lebih akurat</li>
                <li>• Pencarian tidak membedakan huruf besar dan kecil</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  )
}