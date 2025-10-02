'use client'

import { useState, useEffect } from 'react'
import MemberLayout from '@/components/layout/MemberLayout'
import toast from 'react-hot-toast'
import { 
  Newspaper,
  Calendar,
  User,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  Tag
} from 'lucide-react'

interface News {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  imagePath?: string
  publishedAt: string
  viewCount: number
  author: {
    name: string
  }
  category: {
    name: string
  }
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNext: boolean
  hasPrev: boolean
}

export default function BeritaPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState<Array<{id: number, name: string}>>([])

  useEffect(() => {
    fetchNews()
    fetchCategories()
  }, [pagination.currentPage, searchQuery, selectedCategory])

  const fetchNews = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: '6'
      })
      
      if (searchQuery) params.append('search', searchQuery)
      if (selectedCategory) params.append('category', selectedCategory)

      const response = await fetch(`/api/public/news?${params}`)
      if (response.ok) {
        const data = await response.json()
        setNews(data.news)
        setPagination(data.pagination)
      } else {
        toast.error('Gagal memuat berita')
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      toast.error('Terjadi kesalahan saat memuat berita')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    fetchNews()
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <MemberLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pgri-red"></div>
        </div>
      </MemberLayout>
    )
  }

  return (
    <MemberLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Newspaper className="h-6 w-6 mr-2 text-pgri-red" />
            Berita & Informasi
          </h1>
          <p className="text-gray-600 mt-1">Berita terkini dan informasi penting dari PGRI</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </form>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-field min-w-[150px]"
              >
                <option value="">Semua Kategori</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* News Grid */}
        {news.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {news.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {/* News Image */}
                  {item.imagePath ? (
                    <img
                      src={item.imagePath}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Newspaper className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  {/* News Content */}
                  <div className="p-4">
                    {/* Category and Date */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-pgri-red bg-opacity-10 text-pgri-red">
                        <Tag className="h-3 w-3 mr-1" />
                        {item.category.name}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(item.publishedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                      {truncateText(item.excerpt, 120)}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {item.author.name}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {item.viewCount} views
                      </span>
                    </div>

                    {/* Read More Button */}
                    <div className="mt-4">
                      <a
                        href={`/member/berita/${item.slug}`}
                        className="text-pgri-red hover:text-red-700 text-sm font-medium inline-flex items-center"
                      >
                        Baca Selengkapnya
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-700">
                  Menampilkan {((pagination.currentPage - 1) * 6) + 1} - {Math.min(pagination.currentPage * 6, pagination.totalItems)} dari {pagination.totalItems} berita
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        page === pagination.currentPage
                          ? 'bg-pgri-red text-white'
                          : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak Ada Berita</h3>
            <p className="text-gray-600">
              {searchQuery || selectedCategory 
                ? 'Tidak ditemukan berita yang sesuai dengan pencarian Anda.'
                : 'Belum ada berita yang dipublikasikan.'
              }
            </p>
            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('')
                  setPagination(prev => ({ ...prev, currentPage: 1 }))
                }}
                className="mt-4 btn-outline"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </div>
    </MemberLayout>
  )
}