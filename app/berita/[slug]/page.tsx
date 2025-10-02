'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'
import { Calendar, User, Tag, ArrowLeft, Share2 } from 'lucide-react'

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

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [news, setNews] = useState<News | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.slug) {
      fetchNewsDetail(params.slug as string)
    }
  }, [params.slug])

  const fetchNewsDetail = async (slug: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/public/news/${slug}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setNews(data.news)
        } else {
          setError('Berita tidak ditemukan')
        }
      } else {
        setError('Berita tidak ditemukan')
      }
    } catch (error) {
      console.error('Error fetching news detail:', error)
      setError('Terjadi kesalahan saat memuat berita')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const shareNews = () => {
    if (navigator.share && news) {
      navigator.share({
        title: news.title,
        text: news.excerpt,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link berhasil disalin!')
    }
  }

  if (loading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-300"></div>
              <div className="p-8">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-6 w-3/4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (error || !news) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Berita tidak ditemukan'}
            </h1>
            <Link
              href="/berita"
              className="inline-flex items-center text-pgri-red hover:text-pgri-red-dark font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Berita
            </Link>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/berita"
              className="inline-flex items-center text-gray-600 hover:text-pgri-red transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Berita
            </Link>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Featured Image */}
            {news.image && (
              <div className="relative h-64 md:h-96 overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Article Header */}
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(news.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{news.author.name}</span>
                </div>
                {news.category && (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span className="bg-pgri-red text-white px-2 py-1 rounded-full text-xs">
                      {news.category.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={shareNews}
                  className="flex items-center text-pgri-red hover:text-pgri-red-dark transition-colors duration-200 ml-auto"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Bagikan
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-justify">
                {news.title}
              </h1>

              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-8 font-medium text-justify">
                  {news.excerpt}
                </p>
                
                <div 
                  className="text-gray-800 leading-relaxed text-justify"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </PublicLayout>
  )
}