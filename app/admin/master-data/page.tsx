'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { 
  Database,
  Plus,
  Edit,
  Trash2,
  Search,
  MapPin,
  Briefcase,
  School,
  Building,
  Tag,
  Save,
  X,
  AlertCircle,
  Check
} from 'lucide-react'

interface MasterDataItem {
  id: string
  name: string
  code?: string
  description?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface MasterDataCategory {
  key: string
  name: string
  icon: any
  description: string
}

const masterDataCategories: MasterDataCategory[] = [
  {
    key: 'provinces',
    name: 'Provinsi',
    icon: MapPin,
    description: 'Data provinsi di Indonesia'
  },
  {
    key: 'cities',
    name: 'Kota/Kabupaten',
    icon: Building,
    description: 'Data kota dan kabupaten'
  },
  {
    key: 'positions',
    name: 'Jabatan',
    icon: Briefcase,
    description: 'Data jabatan dalam pendidikan'
  },
  {
    key: 'school-types',
    name: 'Jenis Sekolah',
    icon: School,
    description: 'Data jenis sekolah (SD, SMP, SMA, dll)'
  },
  {
    key: 'religions',
    name: 'Agama',
    icon: Tag,
    description: 'Data agama untuk anggota'
  },
  {
    key: 'educations',
    name: 'Pendidikan',
    icon: School,
    description: 'Data tingkat pendidikan'
  },
  {
    key: 'employee-statuses',
    name: 'Status Pegawai',
    icon: Briefcase,
    description: 'Data status kepegawaian'
  },
  {
    key: 'news-categories',
    name: 'Kategori Berita',
    icon: Tag,
    description: 'Kategori untuk berita dan konten'
  }
]

export default function MasterDataPage() {
  const [selectedCategory, setSelectedCategory] = useState('provinces')
  const [data, setData] = useState<MasterDataItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MasterDataItem | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [selectedCategory])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/master-data/${selectedCategory}`)
      if (response.ok) {
        const result = await response.json()
        setData(result.data || [])
      } else {
        toast.error('Gagal memuat data')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Nama harus diisi')
      return
    }

    try {
      setSaving(true)
      const url = editingItem 
        ? `/api/admin/master-data/${selectedCategory}/${editingItem.id}`
        : `/api/admin/master-data/${selectedCategory}`
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(`Data berhasil ${editingItem ? 'diperbarui' : 'ditambahkan'}`)
        setShowModal(false)
        setEditingItem(null)
        setFormData({ name: '', code: '', description: '', isActive: true })
        fetchData()
      } else {
        const result = await response.json()
        toast.error(result.message || 'Gagal menyimpan data')
      }
    } catch (error) {
      console.error('Error saving data:', error)
      toast.error('Terjadi kesalahan saat menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/master-data/${selectedCategory}/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Data berhasil dihapus')
        fetchData()
      } else {
        const result = await response.json()
        toast.error(result.message || 'Gagal menghapus data')
      }
    } catch (error) {
      console.error('Error deleting data:', error)
      toast.error('Terjadi kesalahan saat menghapus data')
    }
  }

  const handleEdit = (item: MasterDataItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      code: item.code || '',
      description: item.description || '',
      isActive: item.isActive
    })
    setShowModal(true)
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ name: '', code: '', description: '', isActive: true })
    setShowModal(true)
  }

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.code && item.code.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const currentCategory = masterDataCategories.find(cat => cat.key === selectedCategory)

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Master</h1>
          <p className="text-gray-600">Kelola data referensi sistem</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Categories */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kategori Data</h3>
              <nav className="space-y-2">
                {masterDataCategories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        selectedCategory === category.key
                          ? 'bg-pgri-red text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div>{category.name}</div>
                        <div className={`text-xs ${selectedCategory === category.key ? 'text-red-100' : 'text-gray-400'}`}>
                          {category.description}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {currentCategory && (
                      <>
                        <currentCategory.icon className="h-6 w-6 text-pgri-red mr-3" />
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">{currentCategory.name}</h2>
                          <p className="text-sm text-gray-600">{currentCategory.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleAdd}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pgri-red hover:bg-red-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Data
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Cari data..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                  />
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-8">
                    <div className="animate-pulse space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                          <div className="h-4 bg-gray-300 rounded w-1/6"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : filteredData.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama
                        </th>
                        {selectedCategory !== 'news-categories' && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Kode
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Deskripsi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          </td>
                          {selectedCategory !== 'news-categories' && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.code || '-'}</div>
                            </td>
                          )}
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{item.description || '-'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.isActive ? (
                                <>
                                  <Check className="w-3 h-3 mr-1" />
                                  Aktif
                                </>
                              ) : (
                                <>
                                  <X className="w-3 h-3 mr-1" />
                                  Nonaktif
                                </>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Hapus"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12">
                    <Database className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada data</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm ? 'Tidak ada data yang sesuai dengan pencarian.' : 'Belum ada data yang ditambahkan.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingItem ? 'Edit Data' : 'Tambah Data Baru'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                      placeholder="Masukkan nama"
                    />
                  </div>

                  {/* Code (not for news categories) */}
                  {selectedCategory !== 'news-categories' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kode
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                        placeholder="Masukkan kode"
                      />
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                      placeholder="Masukkan deskripsi"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
                      />
                      <span className="ml-2 text-sm text-gray-700">Aktif</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pgri-red hover:bg-red-700 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Menyimpan...' : 'Simpan'}
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