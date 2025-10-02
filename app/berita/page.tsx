'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PublicLayout from '@/components/layout/PublicLayout'
import { Calendar, Eye, ArrowRight, Search, Filter } from 'lucide-react'

interface News {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string | null
  createdAt: string
  author: { name: string }
  category: { name: string } | null
}

interface Category {
  id: string
  name: string
}

export default function BeritaPage() {
  const [news, setNews] = useState<News[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchNews()
  }, [currentPage, searchTerm, selectedCategory])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/public/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchNews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '6'
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      
      const response = await fetch(`/api/public/news?${params}`)
      if (response.ok) {
        const data = await response.json()
        setNews(data.news || [])
        setTotalPages(data.pagination?.totalPages || 1)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchNews()
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
      <main className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="relative bg-gradient-to-br from-pgri-red via-pgri-red-dark to-red-800 text-white py-6 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                  <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V9a1 1 0 00-1-1h-1v3a2 2 0 01-2 2H5a2 2 0 01-2-2V9a1 1 0 00-1 1v5.5a1.5 1.5 0 01-3 0V9a2 2 0 012-2h1V5a2 2 0 012-2h8a2 2 0 012 2v2z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                Berita & Informasi
              </h1>
              <p className="text-sm text-red-100 max-w-2xl mx-auto">
                Informasi terkini kegiatan dan perkembangan PGRI Kabupaten OKU Timur
              </p>
              <div className="mt-4 flex justify-center">
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-pgri-red transition-colors" />
                  <input
                    type="text"
                    placeholder="Cari berita yang Anda inginkan..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pgri-red/20 focus:border-pgri-red transition-all duration-200 text-gray-700 placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-pgri-red text-white px-4 py-2 rounded-lg hover:bg-pgri-red-dark transition-colors duration-200 text-sm font-medium"
                  >
                    Cari
                  </button>
                </div>
              </form>
              
              {/* Category Filter */}
              <div className="flex items-center gap-3 min-w-[200px]">
                <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                  <Filter className="text-gray-500 h-5 w-5" />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-pgri-red/20 focus:border-pgri-red transition-all duration-200 text-gray-700 bg-white"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* News Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse border border-gray-100">
                  <div className="h-56 bg-gradient-to-r from-gray-200 to-gray-300"></div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-6 bg-gray-200 rounded-full w-32"></div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded-lg mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded-lg mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="h-8 bg-gray-300 rounded-lg w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : news.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {news.map((item) => (
                  <article key={item.id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                    {item.image && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {item.category && (
                          <div className="absolute top-3 left-3">
                            <span className="bg-pgri-red/90 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                              {item.category.name}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <div className="flex items-center bg-gray-50 px-2 py-1 rounded-full">
                          <Calendar className="h-3 w-3 mr-1 text-pgri-red" />
                          <span className="font-medium">{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                      
                      <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-pgri-red transition-colors duration-300">
                        {item.title}
                      </h2>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed text-sm">
                        {item.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gradient-to-r from-pgri-red to-pgri-red-dark rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                            {item.author.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs text-gray-600 font-medium truncate">
                            {item.author.name}
                          </span>
                        </div>
                        
                        <Link
                          href={`/berita/${item.slug}`}
                          className="inline-flex items-center bg-gradient-to-r from-pgri-red to-pgri-red-dark text-white px-2 py-1 rounded-md hover:shadow-md transform hover:scale-105 transition-all duration-200 text-xs font-medium"
                        >
                          Baca
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-16">
                  <nav className="flex items-center space-x-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-2">
                    {currentPage > 1 && (
                      <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 flex items-center"
                      >
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                        Sebelumnya
                      </button>
                    )}
                    
                    <div className="flex space-x-1">
                      {[...Array(totalPages)].map((_, index) => {
                        const page = index + 1
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-12 h-12 text-sm font-bold rounded-xl transition-all duration-200 ${
                              currentPage === page
                                ? 'text-white bg-gradient-to-r from-pgri-red to-pgri-red-dark shadow-lg transform scale-110'
                                : 'text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>

                    {currentPage < totalPages && (
                      <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 flex items-center"
                      >
                        Selanjutnya
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </button>
                    )}
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Belum Ada Berita Tersedia
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Saat ini belum ada berita yang dipublikasikan. Silakan kembali lagi nanti untuk mendapatkan informasi terkini dari PGRI Kabupaten OKU Timur.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory('')
                      setCurrentPage(1)
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-pgri-red to-pgri-red-dark text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-medium"
                  >
                    Reset Filter
                  </button>
                  <Link
                    href="/"
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    Kembali ke Beranda
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </PublicLayout>
  )
}