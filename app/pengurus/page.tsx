'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import PublicLayout from '@/components/layout/PublicLayout'
import { Users, Mail, Phone, MapPin } from 'lucide-react'

interface Officer {
  id: number
  name: string
  position: string
  level: string
  district?: {
    id: number
    name: string
  }
  email?: string
  phone?: string
  address?: string
  photo?: string
  description?: string
}

export default function PengurusPage() {
  const [officers, setOfficers] = useState<Officer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOfficers()
  }, [])

  const fetchOfficers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/public/officers')
      if (response.ok) {
        const data = await response.json()
        setOfficers(data)
      } else {
        console.error('Failed to fetch officers')
        // Fallback to empty array if API fails
        setOfficers([])
      }
    } catch (error) {
      console.error('Error fetching officers:', error)
      // Fallback to empty array if API fails
      setOfficers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-pgri-red to-pgri-red-dark text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Struktur Pengurus
              </h1>
              <p className="text-lg text-red-100 mx-auto whitespace-nowrap">
                Mengenal lebih dekat pengurus PGRI Kabupaten OKU Timur periode 2025-2030
              </p>
            </div>
          </div>
        </div>

        {/* Officers Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pgri-red mx-auto"></div>
              <p className="mt-4 text-gray-600">Memuat data pengurus...</p>
            </div>
          ) : officers.length > 0 ? (
            <div className="space-y-12">
              {/* Pengurus Kabupaten Section */}
              {(() => {
                // Normalisasi level: dukung nilai seperti "Pengurus Kabupaten" atau "Kabupaten"
                const kabuparenOfficers = officers.filter(officer =>
                  (officer.level || '').toLowerCase().includes('kabupaten')
                );
                return kabuparenOfficers.length > 0 && (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengurus Kabupaten</h2>
                      <div className="w-20 h-1 bg-pgri-red rounded"></div>
                      <p className="text-gray-600 mt-2">{kabuparenOfficers.length} orang pengurus tingkat kabupaten</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {kabuparenOfficers.map((officer) => (
                        <div key={officer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                {officer.photo ? (
                                  <Image
                                    src={officer.photo}
                                    alt={officer.name}
                                    width={80}
                                    height={80}
                                    className="rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Users className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {officer.name}
                                </h3>
                                <p className="text-sm text-pgri-red font-medium">
                                  {officer.position}
                                </p>
                                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                                  Kabupaten
                                </span>
                              </div>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                              {officer.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-4 w-4 mr-2 text-pgri-red" />
                                  <a href={`tel:${officer.phone}`} className="hover:text-pgri-red">
                                    {officer.phone}
                                  </a>
                                </div>
                              )}
                              {officer.address && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>{officer.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Pengurus Cabang Section */}
              {(() => {
                const cabangOfficers = officers.filter(officer =>
                  (officer.level || '').toLowerCase().includes('cabang')
                );
                return cabangOfficers.length > 0 && (
                  <div>
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Pengurus Cabang</h2>
                      <div className="w-20 h-1 bg-green-500 rounded"></div>
                      <p className="text-gray-600 mt-2">{cabangOfficers.length} orang pengurus tingkat cabang</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cabangOfficers.map((officer) => (
                        <div key={officer.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0">
                                {officer.photo ? (
                                  <Image
                                    src={officer.photo}
                                    alt={officer.name}
                                    width={80}
                                    height={80}
                                    className="rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Users className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                  {officer.name}
                                </h3>
                                <p className="text-sm text-pgri-red font-medium">
                                  {officer.position}
                                </p>
                                <div className="flex flex-col gap-1 mt-1">
                                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Cabang
                                  </span>
                                  {officer.district && (
                                    <span className="text-xs text-gray-600">
                                      Kec. {officer.district.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                              {officer.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="h-4 w-4 mr-2 text-pgri-red" />
                                  <a href={`tel:${officer.phone}`} className="hover:text-pgri-red">
                                    {officer.phone}
                                  </a>
                                </div>
                              )}
                              {officer.address && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2 text-pgri-red" />
                                  <span>{officer.address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Data Pengurus Belum Tersedia
              </h3>
              <p className="text-gray-500">
                Informasi struktur pengurus akan ditampilkan di sini.
              </p>
            </div>
          )}
        </div>


      </div>
    </PublicLayout>
  )
}