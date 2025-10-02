'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import AdminLayout from '@/components/layout/AdminLayout'
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Upload,
  X,
  Save,
  User,
  ArrowLeft
} from 'lucide-react'

interface Officer {
  id: number
  name: string
  npa?: string
  position: string
  level: string
  periode?: string
  districtId?: number
  district?: {
    id: number
    name: string
  }
  whatsapp?: string
  workplace?: string
  address?: string
  photo?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface District {
  id: number
  name: string
}

export default function AdminPengurusPage() {
  const router = useRouter()
  const [officers, setOfficers] = useState<Officer[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [officerToDelete, setOfficerToDelete] = useState<Officer | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    npa: '',
    position: '',
    level: 'Pengurus Kabupaten',
    periode: '2025-2030',
    districtId: '',
    whatsapp: '',
    workplace: '',
    address: '',
    photo: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    fetchOfficers()
    fetchDistricts()
  }, [])

  const fetchOfficers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/officers')
      if (response.ok) {
        const data = await response.json()
        setOfficers(data)
      } else {
        toast.error('Gagal memuat data pengurus')
      }
    } catch (error) {
      console.error('Error fetching officers:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/admin/districts')
      if (response.ok) {
        const data = await response.json()
        setDistricts(data)
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (1MB max)
      if (file.size > 1024 * 1024) {
        toast.error('Ukuran file foto maksimal 1MB')
        return
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file harus JPG, JPEG, atau PNG')
        return
      }

      setPhotoFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadPhoto = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    if (!data.success) {
      throw new Error(data.message || 'Gagal mengupload foto')
    }

    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let photoUrl = formData.photo

      // Upload photo if new file selected
      if (photoFile) {
        photoUrl = await uploadPhoto(photoFile)
      }

      const url = editingOfficer 
        ? `/api/admin/officers/${editingOfficer.id}`
        : '/api/admin/officers'
      
      const method = editingOfficer ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          photo: photoUrl,
          districtId: formData.districtId ? parseInt(formData.districtId) : null
        }),
      })

      if (response.ok) {
        toast.success(editingOfficer ? 'Pengurus berhasil diperbarui' : 'Pengurus berhasil ditambahkan')
        fetchOfficers()
        resetForm()
        setShowModal(false)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error saving officer:', error)
      toast.error('Terjadi kesalahan saat menyimpan data')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      npa: '',
      position: '',
      level: 'Pengurus Kabupaten',
      periode: '2025-2030',
      districtId: '',
      whatsapp: '',
      workplace: '',
      address: '',
      photo: '',
      order: 0,
      isActive: true
    })
    setPhotoFile(null)
    setPhotoPreview(null)
    setEditingOfficer(null)
  }

  const handleEdit = (officer: Officer) => {
    setEditingOfficer(officer)
    setFormData({
      name: officer.name,
      npa: officer.npa || '',
      position: officer.position,
      level: officer.level,
      periode: officer.periode || '2025-2030',
      districtId: officer.districtId?.toString() || '',
      whatsapp: officer.whatsapp || '',
      workplace: officer.workplace || '',
      address: officer.address || '',
      photo: officer.photo || '',
      order: officer.order,
      isActive: officer.isActive
    })
    setPhotoFile(null)
    setPhotoPreview(officer.photo || null)
    setShowModal(true)
  }

  const handleDelete = async () => {
    if (!officerToDelete) return

    try {
      const response = await fetch(`/api/admin/officers/${officerToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Pengurus berhasil dihapus')
        fetchOfficers()
        setShowDeleteModal(false)
        setOfficerToDelete(null)
      } else {
        toast.error('Gagal menghapus pengurus')
      }
    } catch (error) {
      console.error('Error deleting officer:', error)
      toast.error('Terjadi kesalahan saat menghapus data')
    }
  }



  const filteredOfficers = officers.filter(officer => {
    const matchesSearch = officer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         officer.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = levelFilter === 'all' || officer.level === levelFilter
    return matchesSearch && matchesLevel
  })

  return (
    <AdminLayout>
      <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pengurus</h1>
          <p className="text-gray-600 mt-1">Kelola data pengurus PGRI Kabupaten OKU Timur</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Batal
          </button>
          <button
             onClick={() => {
               setEditingOfficer(null)
               setFormData({
                 name: '',
                 npa: '',
                 position: '',
                 level: 'Pengurus Kabupaten',
                 periode: '2025-2030',
                 districtId: '',
                 whatsapp: '',
                 workplace: '',
                 address: '',
                 photo: '',
                 order: 0,
                 isActive: true
               })
               setShowModal(true)
             }}
             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
           >
             <Plus className="h-4 w-4" />
             Tambah Pengurus
           </button>
        </div>
      </div>

      {/* Header Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari pengurus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">Semua Level</option>
                <option value="Pengurus Kabupaten">Pengurus Kabupaten</option>
                <option value="Pengurus Cabang">Pengurus Cabang</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Officers Sections */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      ) : filteredOfficers.length > 0 ? (
        <div className="space-y-6">
          {/* Pengurus Kabupaten Section */}
          {(() => {
            const kabuparenOfficers = filteredOfficers.filter(officer => officer.level === 'Pengurus Kabupaten');
            return kabuparenOfficers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-900">Pengurus Kabupaten</h3>
                  <p className="text-sm text-blue-700">{kabuparenOfficers.length} orang</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pengurus
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jabatan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Urutan
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {kabuparenOfficers.map((officer) => (
                        <tr key={officer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {officer.photo ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={officer.photo}
                                    alt={officer.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-600" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {officer.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {officer.whatsapp && `WA: ${officer.whatsapp}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{officer.position}</div>
                            <div className="text-sm text-gray-500">{officer.workplace}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              officer.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {officer.isActive ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {officer.order}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(officer)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(officer.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {/* Pengurus Cabang Section */}
          {(() => {
            const cabangOfficers = filteredOfficers.filter(officer => officer.level === 'Pengurus Cabang');
            return cabangOfficers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-green-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-green-900">Pengurus Cabang</h3>
                  <p className="text-sm text-green-700">{cabangOfficers.length} orang</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pengurus
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jabatan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kecamatan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Urutan
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cabangOfficers.map((officer) => (
                        <tr key={officer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {officer.photo ? (
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={officer.photo}
                                    alt={officer.name}
                                  />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <User className="h-5 w-5 text-gray-600" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {officer.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {officer.whatsapp && `WA: ${officer.whatsapp}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{officer.position}</div>
                            <div className="text-sm text-gray-500">{officer.workplace}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{officer.district?.name || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              officer.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {officer.isActive ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {officer.order}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(officer)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(officer.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada data pengurus</h3>
          <p className="text-gray-600 mb-4">Mulai dengan menambahkan pengurus pertama</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                resetForm()
                setShowModal(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Pengurus
            </button>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Batal
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingOfficer ? 'Edit Pengurus' : 'Tambah Pengurus'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NPA
                  </label>
                  <input
                    type="text"
                    value={formData.npa}
                    onChange={(e) => setFormData({ ...formData, npa: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan Nomor Pokok Anggota"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jabatan *
                  </label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih Jabatan</option>
                    <option value="Ketua">Ketua</option>
                    <option value="Wakil Ketua">Wakil Ketua</option>
                    <option value="Sekretaris">Sekretaris</option>
                    <option value="Bendahara">Bendahara</option>
                    <option value="Ketua Bidang">Ketua Bidang</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periode *
                  </label>
                  <select
                    required
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="2025-2030">2025 - 2030</option>
                    <option value="2030-2035">2030 - 2035</option>
                    <option value="2035-2040">2035 - 2040</option>
                    <option value="2040-2045">2040 - 2045</option>
                    <option value="2045-2050">2045 - 2050</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilihan Pengurus *
                  </label>
                  <select
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Pengurus Kabupaten">Pengurus Kabupaten</option>
                    <option value="Pengurus Cabang">Pengurus Cabang</option>
                  </select>
                </div>

                {formData.level === 'Pengurus Cabang' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kecamatan
                    </label>
                    <select
                      value={formData.districtId}
                      onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih Kecamatan</option>
                      {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No WA
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: 08123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tempat Tugas
                  </label>
                  <input
                    type="text"
                    value={formData.workplace}
                    onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Contoh: Kantor Kecamatan, Sekolah, dll"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Alamat lengkap"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Pengurus
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-500 transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      {photoPreview ? (
                        <div className="mb-4">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="mx-auto h-32 w-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoPreview(null)
                              setPhotoFile(null)
                              setFormData({ ...formData, photo: '' })
                            }}
                            className="mt-2 text-sm text-red-600 hover:text-red-800"
                          >
                            Hapus Foto
                          </button>
                        </div>
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload foto</span>
                          <input
                            type="file"
                            onChange={handlePhotoChange}
                            className="sr-only"
                            accept="image/jpeg,image/jpg,image/png"
                          />
                        </label>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG maksimal 1MB
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Status Aktif
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    {editingOfficer ? 'Perbarui' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && officerToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Apakah Anda yakin ingin menghapus pengurus <strong>{officerToDelete.name}</strong>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminLayout>
  )
}