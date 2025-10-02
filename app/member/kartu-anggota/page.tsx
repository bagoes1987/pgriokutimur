'use client'

import { useState, useEffect, useRef } from 'react'
import MemberLayout from '@/components/layout/MemberLayout'
import toast from 'react-hot-toast'
import { 
  CreditCard,
  Download,
  Printer,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Building,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface MemberData {
  id: number
  email: string
  npa: string
  nik: string
  name: string
  birthPlace: string
  birthDate: string
  gender: string
  address: string
  phoneNumber: string
  photo?: string
  institutionName: string
  status: string
  createdAt: string
  province: { name: string }
  regency: { name: string }
  job: { name: string }
  employeeStatus?: { name: string }
}

export default function KartuAnggotaPage() {
  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [photoTimestamp, setPhotoTimestamp] = useState(() => {
    // Initialize from localStorage if available, otherwise use current time
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('memberPhotoTimestamp')
      if (saved) {
        console.log('🚀 KARTU INIT: Using saved timestamp from localStorage:', saved)
        return parseInt(saved)
      }
    }
    const newTimestamp = Date.now()
    console.log('🚀 KARTU INIT: Using new timestamp:', newTimestamp)
    return newTimestamp
  })
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMemberData()
  }, [])

  // Listen for photo updates from localStorage and custom events
  useEffect(() => {
    // Get initial timestamp from localStorage
    const savedTimestamp = localStorage.getItem('memberPhotoTimestamp')
    if (savedTimestamp) {
      setPhotoTimestamp(parseInt(savedTimestamp))
    }

    // Listen for photo update events
    const handlePhotoUpdate = () => {
      const newTimestamp = localStorage.getItem('memberPhotoTimestamp')
      if (newTimestamp) {
        setPhotoTimestamp(parseInt(newTimestamp))
      }
    }

    window.addEventListener('photoUpdated', handlePhotoUpdate)
    window.addEventListener('storage', handlePhotoUpdate)

    return () => {
      window.removeEventListener('photoUpdated', handlePhotoUpdate)
      window.removeEventListener('storage', handlePhotoUpdate)
    }
  }, [])

  const fetchMemberData = async () => {
    try {
      const response = await fetch('/api/member/biodata')
      if (response.ok) {
        const data = await response.json()
        setMemberData(data.member)
      } else {
        toast.error('Gagal memuat data anggota')
      }
    } catch (error) {
      console.error('Error fetching member data:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (cardRef.current) {
      // Add print styles
      const printStyle = document.createElement('style')
      printStyle.id = 'print-styles'
      printStyle.innerHTML = `
        @media print {
          * {
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          
          body {
            background: white !important;
            padding: 5mm !important;
            font-family: system-ui, -apple-system, sans-serif !important;
          }
          
          .card-container {
            width: 240px !important;
            height: 150px !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            background: white !important;
            border: 2px solid #fca5a5 !important;
            border-radius: 6px !important;
            box-shadow: none !important;
            display: flex !important;
            flex-direction: column !important;
            position: relative !important;
            overflow: visible !important;
          }
          
          .card-header {
            background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
            color: white !important;
            padding: 4px !important;
            text-align: center !important;
            border-radius: 6px 6px 0 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .card-header img {
            width: 25px !important;
            height: 25px !important;
            background: white !important;
            border-radius: 50% !important;
            padding: 1px !important;
          }
          
          .card-header h4 {
            font-size: 8px !important;
            font-weight: bold !important;
            line-height: 1.0 !important;
            margin: 0 !important;
            letter-spacing: 0.2px !important;
            color: white !important;
          }
          
          .card-header p {
            font-size: 7px !important;
            font-weight: 600 !important;
            margin: 0 !important;
            letter-spacing: 0.1px !important;
            color: white !important;
            background: transparent !important;
          }
          
          /* Ensure kabupaten text specifically has NO white background */
          .card-header .flex .text-center p:not(.bg-white) {
            background: transparent !important;
            color: white !important;
            border: none !important;
            box-shadow: none !important;
          }
          
          /* Style for KARTU ANGGOTA text only - very specific selector */
          .card-header .text-center p.bg-white.text-red-600,
          .card-header .text-center p[class*="bg-white"][class*="text-red-600"] {
            font-size: 9px !important;
            font-weight: bold !important;
            background: white !important;
            color: #dc2626 !important;
            padding: 2px 6px !important;
            border-radius: 6px !important;
            display: inline-block !important;
            margin-top: 1px !important;
            letter-spacing: 0.3px !important;
            border: none !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.15) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Hide ALL decorative elements during print */
          .card-header .absolute,
          .absolute {
            display: none !important;
          }
          
          /* Remove all decorative borders and patterns */
          .card-container .absolute {
            display: none !important;
          }
          
          /* Ensure all text elements match preview */
          @media print {
            .card-header div {
              margin-bottom: 1px !important;
            }
            
            .card-header .flex {
              gap: 12px !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            .card-header .text-center {
              flex: 1 !important;
            }
            
            /* Force exact styling for KARTU ANGGOTA */
            .card-header p[style*="KARTU ANGGOTA"],
            .card-header p:contains("KARTU ANGGOTA") {
              background: white !important;
              color: #dc2626 !important;
              padding: 2px 8px !important;
              border-radius: 10px !important;
              font-size: 12px !important;
              font-weight: bold !important;
              letter-spacing: 0.5px !important;
              box-shadow: 0 1px 2px rgba(0,0,0,0.1) !important;
            }
          }
          
          .card-body {
            padding: 4px !important;
            display: flex !important;
            gap: 4px !important;
            background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%) !important;
            flex: 1 !important;
            min-height: 90px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .photo-section {
            flex-shrink: 0 !important;
            margin-top: 1px !important;
          }
          
          .photo-section img {
            width: 40px !important;
            height: 50px !important;
            border-radius: 3px !important;
            border: 1px solid #fca5a5 !important;
            object-fit: cover !important;
            display: block !important;
          }
          
          .photo-section > div {
            width: 40px !important;
            height: 50px !important;
            border-radius: 3px !important;
            border: 1px solid #fca5a5 !important;
            background: linear-gradient(135deg, #f3f4f6, #e5e7eb) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            color: #9ca3af !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          /* Hide placeholder when photo exists */
          .photo-section img:not([style*="display: none"]) + div {
            display: none !important;
          }
          
          .info-section {
            flex: 1 !important;
            min-width: 0 !important;
            padding: 2px 0 !important;
          }
          
          .member-name {
            font-size: 8px !important;
            font-weight: bold !important;
            margin-bottom: 0px !important;
            color: #1f2937 !important;
            line-height: 1.1 !important;
            letter-spacing: 0.025em !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            max-width: 100% !important;
          }
          
          .member-detail {
            font-size: 6px !important;
            margin-bottom: 0px !important;
            color: #374151 !important;
            line-height: 1.0 !important;
            display: flex !important;
            align-items: flex-start !important;
          }
          
          .member-detail span {
            font-weight: 600 !important;
            color: #b91c1c !important;
          }
          
          .member-detail .colon {
            color: #b91c1c !important;
            font-weight: 600 !important;
          }
          
          .member-detail .value,
          .member-detail .flex-1 {
            color: #374151 !important;
            font-weight: normal !important;
          }
          
          .member-detail .flex-1 {
            flex: 1 !important;
            word-wrap: break-word !important;
            max-height: 10px !important;
            overflow: hidden !important;
          }
          
          .card-footer {
            background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
            color: white !important;
            padding: 2px 4px !important;
            text-align: center !important;
            font-size: 6px !important;
            font-weight: 600 !important;
            letter-spacing: 0.2px !important;
            flex-shrink: 0 !important;
            margin-top: auto !important;
            border-radius: 0 0 6px 6px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          .security-pattern {
            position: absolute !important;
            bottom: 4px !important;
            right: 4px !important;
            opacity: 0.08 !important;
            font-size: 8px !important;
            color: #dc2626 !important;
            font-weight: bold !important;
            transform: rotate(45deg) !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          /* Hide everything except the card for printing */
          @page {
            size: A4 !important;
            margin: 5mm !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .print-container {
            transform: scale(0.8) !important;
            transform-origin: top left !important;
          }
          
          body * {
            visibility: hidden !important;
          }
          
          .card-container,
          .card-container * {
            visibility: visible !important;
          }
          
          .card-container {
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
            position: relative !important;
            margin: 0 auto !important;
            max-width: 85.6mm !important;
            max-height: 54mm !important;
            transform: scale(0.95) !important;
            transform-origin: center !important;
          }
          
          /* Ensure the card fits perfectly on one page */
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
          
          /* Center the card on the page */
          .card-container {
            display: block !important;
            margin-top: 1cm !important;
            margin-bottom: 1cm !important;
          }
        }
      `
      document.head.appendChild(printStyle)

      // Print
      window.print()

      // Cleanup after print - remove print styles only
      setTimeout(() => {
        const printStyleElement = document.getElementById('print-styles')
        if (printStyleElement) {
          printStyleElement.remove()
        }
      }, 1000)
    }
  }

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      
      // Call the API endpoint for PDF generation
      const response = await fetch('/api/member/kartu-anggota/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: memberData?.id
        })
      })

      if (!response.ok) {
        throw new Error('Gagal mengunduh kartu anggota')
      }

      // Get the PDF blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `kartu-anggota-${memberData?.name?.replace(/\s+/g, '-')}.pdf`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      window.URL.revokeObjectURL(url)
      
      toast.success('Kartu anggota berhasil diunduh!')
    } catch (error) {
      console.error('Error downloading card:', error)
      toast.error('Gagal mengunduh kartu anggota. Silakan coba lagi.')
    } finally {
      setIsDownloading(false)
    }
  }

  // Helper function to get employee status
  const getEmployeeStatus = () => {
    // Use the actual employee status from the database
    return memberData?.employeeStatus?.name || 'Lainnya'
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

  if (!memberData) {
    return (
      <MemberLayout>
        <div className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h2>
            <p className="text-gray-600">Gagal memuat data anggota.</p>
          </div>
        </div>
      </MemberLayout>
    )
  }

  return (
    <MemberLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <CreditCard className="h-6 w-6 mr-2 text-pgri-red" />
              Kartu Anggota
            </h1>
            <p className="text-gray-600 mt-1">Kartu identitas anggota PGRI</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Aktif
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Member Card Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Preview Kartu</h3>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrint}
                  className="btn-outline flex items-center text-sm"
                >
                  <Printer className="h-4 w-4 mr-1" />
                  Cetak
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="btn-primary flex items-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                      Mengunduh...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1" />
                      Unduh PDF
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card Design */}
            <div className="flex justify-center">
              <div 
                ref={cardRef}
                className="card-container relative bg-white rounded-lg shadow-2xl border-2 border-red-200 overflow-visible flex flex-col"
                style={{
                  width: '323px',  // 8.56cm converted to pixels (8.56 * 37.8)
                  height: '220px', // Increased height to ensure footer is visible
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {/* Card Header with PGRI Logo */}
                <div className="card-header bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white p-2 relative">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <img 
                      src="/images/Logo-pgri-png.svg" 
                      alt="Logo PGRI" 
                      className="w-10 h-10 bg-white rounded-full p-1 shadow-sm"
                    />
                    <div className="text-center flex-1">
                      <h4 className="text-[12px] font-bold leading-tight tracking-wide">PERSATUAN GURU REPUBLIK INDONESIA</h4>
                      <p className="text-[11px] font-semibold tracking-wide">KABUPATEN OGAN KOMERING ULU TIMUR</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] font-bold bg-white text-red-600 px-4 py-1 rounded-full inline-block tracking-wider shadow-sm">
                      KARTU ANGGOTA
                    </p>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-6 h-6 bg-white bg-opacity-10 rounded-full -mr-3 -mt-3"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 bg-white bg-opacity-10 rounded-full -ml-2 -mb-2"></div>
                </div>

                {/* Card Body */}
                <div className="card-body p-2 bg-gradient-to-br from-gray-50 to-white flex gap-2 flex-1">
                  {/* Photo Section */}
                  <div className="photo-section flex-shrink-0 mt-1">
                    {memberData.photo ? (
                      <img
                        src={`${memberData.photo}?t=${photoTimestamp}`}
                        alt={memberData.name}
                        className="w-12 h-16 object-cover rounded border-2 border-red-300 shadow-md"
                        onError={(e) => {
                          console.log('🔍 KARTU: Error loading photo:', memberData.photo)
                          e.currentTarget.style.display = 'none'
                          e.currentTarget.nextElementSibling?.classList.remove('hidden')
                        }}
                        onLoad={() => {
                          console.log('🔍 KARTU: Photo loaded successfully:', memberData.photo)
                        }}
                      />
                    ) : null}
                    <div className={`w-12 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded border-2 border-red-300 shadow-md flex items-center justify-center ${memberData.photo ? 'hidden' : ''}`}>
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>

                  {/* Info Section */}
                  <div className="info-section flex-1 min-w-0 py-1">
                    <div className="member-name text-[11px] font-bold mb-1 text-black leading-tight tracking-wide">
                      {memberData.name}
                    </div>
                    <div className="space-y-0.5">
                      <div className="member-detail text-[8px] leading-tight flex">
                        <span className="font-semibold text-red-700 w-14">TTL</span>
                        <span className="colon font-semibold text-red-700 mr-1">:</span>
                        <span className="value flex-1 text-black">{memberData.birthPlace}, {new Date(memberData.birthDate).toLocaleDateString('id-ID')}</span>
                      </div>
                      <div className="member-detail text-[8px] leading-tight flex">
                        <span className="font-semibold text-red-700 w-14">NPA</span>
                        <span className="colon font-semibold text-red-700 mr-1">:</span>
                        <span className="value flex-1 text-black">{memberData.npa}</span>
                      </div>
                      <div className="member-detail text-[8px] leading-tight flex">
                        <span className="font-semibold text-red-700 w-14">INSTANSI</span>
                        <span className="colon font-semibold text-red-700 mr-1">:</span>
                        <span className="value flex-1 text-black">{memberData.institutionName.length > 16 ? memberData.institutionName.substring(0, 16) + '...' : memberData.institutionName}</span>
                      </div>
                      <div className="member-detail text-[8px] leading-tight flex">
                        <span className="font-semibold text-red-700 w-14">STATUS</span>
                        <span className="colon font-semibold text-red-700 mr-1">:</span>
                        <span className="value flex-1 text-black">{getEmployeeStatus()}</span>
                      </div>
                      <div className="member-detail text-[8px] leading-tight">
                        <div className="flex">
                          <span className="font-semibold text-red-700 w-14">ALAMAT</span>
                          <span className="colon font-semibold text-red-700 mr-1">:</span>
                          <div className="value flex-1 text-black">
                            <div className="break-words leading-tight max-h-6 overflow-hidden">
                              {memberData.address}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="card-footer bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white p-1.5 text-center">
                  <p className="text-[9px] font-semibold tracking-wide">
                    Berlaku sampai 2025-2026
                  </p>
                </div>

                {/* Professional border pattern */}
                <div className="absolute inset-0 border border-red-300 rounded-lg pointer-events-none"></div>
                
                {/* Security pattern */}
                <div className="absolute bottom-2 right-2 opacity-10">
                  <div className="text-[10px] text-red-600 font-bold transform rotate-45">PGRI</div>
                </div>
                
                {/* Corner decorations */}
                <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-red-300 opacity-30"></div>
                <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-red-300 opacity-30"></div>
              </div>
            </div>

          </div>

          {/* Member Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Anggota</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{memberData.name}</p>
                  <p className="text-sm text-gray-500">Nama Lengkap</p>
                </div>
              </div>

              <div className="flex items-start">
                <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{memberData.npa}</p>
                  <p className="text-sm text-gray-500">Nomor Pokok Anggota (NPA)</p>
                </div>
              </div>

              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {memberData.birthPlace}, {new Date(memberData.birthDate).toLocaleDateString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-500">Tempat, Tanggal Lahir</p>
                </div>
              </div>

              <div className="flex items-start">
                <Building className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{memberData.institutionName}</p>
                  <p className="text-sm text-gray-500">Instansi</p>
                </div>
              </div>

              <div className="flex items-start">
                <Building className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{getEmployeeStatus()}</p>
                  <p className="text-sm text-gray-500">Status Kepegawaian</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {memberData.regency.name}, {memberData.province.name}
                  </p>
                  <p className="text-sm text-gray-500">Wilayah</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{memberData.phoneNumber}</p>
                  <p className="text-sm text-gray-500">Nomor Telepon</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{memberData.email}</p>
                  <p className="text-sm text-gray-500">Email</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-green-800">Keanggotaan Aktif</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Kartu anggota Anda telah aktif dan dapat digunakan untuk berbagai keperluan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MemberLayout>
  )
}