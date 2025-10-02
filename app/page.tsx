'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PublicLayout from '@/components/layout/PublicLayout'
import { 
  Users, 
  Newspaper, 
  UserPlus, 
  BarChart3, 
  ArrowRight,
  Calendar,
  MapPin,
  Eye
} from 'lucide-react'

interface News {
  id: number
  title: string
  excerpt: string
  image: string | null
  createdAt: string
}

interface Stats {
  totalMembers: number
  totalNews: number
  totalOfficers: number
}

export default function HomePage() {
  const [latestNews, setLatestNews] = useState<News[]>([])
  const [stats, setStats] = useState<Stats>({ totalMembers: 0, totalNews: 0, totalOfficers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest news
        const newsResponse = await fetch('/api/public/news?limit=3')
        if (newsResponse.ok) {
          const newsData = await newsResponse.json()
          setLatestNews(newsData.news)
        }

        // Fetch statistics
        const statsResponse = await fetch('/api/public/statistics')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pgri-red to-pgri-red-dark text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="block text-white">Selamat datang di website resmi</span>
              <span className="block text-pgri-yellow mt-2">PGRI Kabupaten OKU Timur</span>
            </h1>
            <p className="text-lg md:text-xl text-red-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Pusat informasi dan pendataan anggota PGRI Kabupaten OKU Timur dalam satu platform digital yang 
              <span className="text-pgri-yellow font-semibold"> modern, akurat, mudah diakses, dan terpercaya </span>
              untuk mendukung pelayanan organisasi yang terintegrasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/daftar"
                className="inline-flex items-center px-6 py-3 bg-pgri-green hover:bg-pgri-green-dark text-white font-semibold rounded-lg transition-colors duration-200"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Daftar Sebagai Anggota
              </Link>
              <Link
                href="/cari-anggota"
                className="inline-flex items-center px-6 py-3 bg-white text-pgri-red hover:bg-gray-100 font-semibold rounded-lg transition-colors duration-200"
              >
                <Users className="h-5 w-5 mr-2" />
                Cari Data Anggota
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Message Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Selamat Datang di Era Baru Pendidikan
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-pgri-red to-pgri-green mx-auto mb-8"></div>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="text-xl mb-6 text-gray-800">
                Dengan bangga kami mempersembahkan <strong>Sistem Pendataan Keanggotaan PGRI Kabupaten OKU Timur</strong> yang telah diperbarui dan diperkuat dengan teknologi terdepan untuk melayani seluruh anggota dengan lebih baik.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold text-blue-800 mb-3">Visi Kami</h3>
                  <p className="text-gray-700">
                    Menjadi organisasi profesi guru yang terdepan dalam memajukan pendidikan berkualitas dan kesejahteraan guru di Kabupaten OKU Timur.
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-l-4 border-green-500">
                  <h3 className="text-xl font-bold text-green-800 mb-3">Komitmen Kami</h3>
                  <p className="text-gray-700">
                    Memberikan pelayanan terbaik kepada seluruh anggota melalui sistem yang transparan, efisien, dan mudah diakses kapan saja.
                  </p>
                </div>
              </div>
              
              <div className="mt-12 p-8 bg-gradient-to-r from-pgri-red/5 to-pgri-green/5 rounded-2xl border border-gray-200">
                <p className="text-lg text-gray-800 mb-4">
                  Bergabunglah dengan lebih dari <strong className="text-pgri-red">{stats.totalMembers.toLocaleString()}</strong> guru profesional yang telah mempercayakan karir dan masa depan mereka bersama PGRI Kabupaten OKU Timur.
                </p>
                <p className="text-gray-700">
                  Bersama-sama kita membangun pendidikan yang lebih baik untuk generasi masa depan Indonesia yang gemilang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Statistik Keanggotaan
            </h2>
            <p className="text-lg text-gray-600">
              Data terkini anggota PGRI Kabupaten OKU Timur
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pgri-red text-white rounded-full mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-pgri-red mb-2">
                {loading ? '...' : stats.totalMembers.toLocaleString()}
              </h3>
              <p className="text-gray-700 font-medium">Total Anggota</p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pgri-green text-white rounded-full mb-4">
                <Newspaper className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-pgri-green mb-2">
                {loading ? '...' : stats.totalNews.toLocaleString()}
              </h3>
              <p className="text-gray-700 font-medium">Berita & Kegiatan</p>
            </div>
            
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-full mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-3xl font-bold text-purple-600 mb-2">
                {loading ? '...' : stats.totalOfficers.toLocaleString()}
              </h3>
              <p className="text-gray-700 font-medium">Pengurus Aktif</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Berita & Kegiatan Terbaru
              </h2>
              <p className="text-lg text-gray-600">
                Informasi terkini seputar kegiatan PGRI OKU Timur
              </p>
            </div>
            <Link
              href="/berita"
              className="hidden md:inline-flex items-center px-4 py-2 text-pgri-red hover:text-pgri-red-dark font-medium transition-colors duration-200"
            >
              Lihat Semua
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.map((news) => (
                <article key={news.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  {news.image ? (
                    <div className="relative h-48">
                      <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-pgri-red to-pgri-red-dark flex items-center justify-center">
                      <Newspaper className="h-16 w-16 text-white opacity-50" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(news.createdAt)}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {news.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {news.excerpt}
                    </p>
                    
                    <Link
                      href={`/berita/${news.id}`}
                      className="inline-flex items-center text-pgri-red hover:text-pgri-red-dark font-medium text-sm transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Baca Selengkapnya
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Belum ada berita tersedia</p>
            </div>
          )}

          <div className="text-center mt-8 md:hidden">
            <Link
              href="/berita"
              className="inline-flex items-center px-6 py-3 bg-pgri-red text-white font-medium rounded-lg hover:bg-pgri-red-dark transition-colors duration-200"
            >
              Lihat Semua Berita
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-pgri-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bergabunglah dengan PGRI OKU Timur
          </h2>
          <p className="text-sm text-green-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Daftarkan diri Anda sebagai anggota PGRI Kabupaten OKU Timur,<br />
            bersama wujudkan guru sejahtera dan pendidikan bermutu untuk OKU Timur Maju Lebih Mulia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/daftar"
              className="inline-flex items-center px-6 py-3 bg-white text-pgri-green hover:bg-gray-100 font-semibold rounded-lg transition-colors duration-200"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Daftar Sekarang
            </Link>

          </div>
        </div>
      </section>
    </PublicLayout>
  )
}