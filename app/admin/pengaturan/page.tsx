'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { 
  Settings,
  Save,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Image as ImageIcon,
  FileText,
  Shield,
  Database,
  Bell,
  Palette,
  Monitor,
  Smartphone,
  Eye,
  EyeOff
} from 'lucide-react'

interface SiteSettings {
  // Basic Info
  siteName: string
  siteDescription: string
  siteKeywords: string
  siteLogo: string
  siteFavicon: string
  
  // Contact Info
  contactEmail: string
  contactPhone: string
  contactAddress: string
  
  // Social Media
  facebookUrl: string
  twitterUrl: string
  instagramUrl: string
  youtubeUrl: string
  
  // SEO Settings
  metaTitle: string
  metaDescription: string
  googleAnalyticsId: string
  
  // Email Settings
  smtpHost: string
  smtpPort: string
  smtpUsername: string
  smtpPassword: string
  smtpSecure: boolean
  
  // System Settings
  maintenanceMode: boolean
  registrationEnabled: boolean
  emailVerificationRequired: boolean
  maxFileUploadSize: number
  allowedFileTypes: string[]
  
  // Theme Settings
  primaryColor: string
  secondaryColor: string
  headerStyle: string
  footerStyle: string
}

export default function TestSimplePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')
  const [settings, setSettings] = useState<SiteSettings>({
    // Basic Info
    siteName: '',
    siteDescription: '',
    siteKeywords: '',
    siteLogo: '',
    siteFavicon: '',
    
    // Contact Info
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    
    // Social Media
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    
    // SEO Settings
    metaTitle: '',
    metaDescription: '',
    googleAnalyticsId: '',
    
    // Email Settings
    smtpHost: '',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    smtpSecure: true,
    
    // System Settings
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: false,
    maxFileUploadSize: 5,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    
    // Theme Settings
    primaryColor: '#dc2626',
    secondaryColor: '#1f2937',
    headerStyle: 'default',
    footerStyle: 'default'
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSettings(data.settings)
        }
      } else {
        toast.error('Gagal memuat pengaturan')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Terjadi kesalahan saat memuat pengaturan')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ settings }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success('Pengaturan berhasil disimpan')
        } else {
          toast.error(data.message || 'Gagal menyimpan pengaturan')
        }
      } else {
        toast.error('Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Terjadi kesalahan saat menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const tabs = [
    { id: 'basic', name: 'Informasi Dasar', icon: Globe },
    { id: 'contact', name: 'Kontak', icon: Phone },
    { id: 'social', name: 'Media Sosial', icon: Facebook },
    { id: 'seo', name: 'SEO', icon: FileText },
    { id: 'email', name: 'Email', icon: Mail },
    { id: 'system', name: 'Sistem', icon: Database },
    { id: 'theme', name: 'Tema', icon: Palette }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pgri-red"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="h-6 w-6 mr-2 text-pgri-red" />
              Test Pengaturan Sederhana
            </h1>
            <p className="text-gray-600 mt-1">Data Pengaturan</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pgri-red hover:bg-pgri-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pgri-red disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Pengaturan
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-pgri-red text-pgri-red'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Dasar Situs</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Situs
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="Masukkan nama situs"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kata Kunci SEO
                  </label>
                  <input
                    type="text"
                    value={settings.siteKeywords}
                    onChange={(e) => handleInputChange('siteKeywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="kata kunci, dipisah, koma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Situs
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                  placeholder="Masukkan deskripsi situs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo Situs
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={settings.siteLogo}
                      onChange={(e) => handleInputChange('siteLogo', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                      placeholder="/images/logo.png"
                    />
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={settings.siteFavicon}
                      onChange={(e) => handleInputChange('siteFavicon', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                      placeholder="/images/favicon.ico"
                    />
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Kontak</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="info@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={settings.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="+62 xxx xxxx xxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap
                </label>
                <textarea
                  value={settings.contactAddress}
                  onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                  placeholder="Masukkan alamat lengkap"
                />
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Media Sosial</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Facebook className="inline h-4 w-4 mr-2" />
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={settings.facebookUrl}
                    onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Twitter className="inline h-4 w-4 mr-2" />
                    Twitter URL
                  </label>
                  <input
                    type="url"
                    value={settings.twitterUrl}
                    onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Instagram className="inline h-4 w-4 mr-2" />
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={settings.instagramUrl}
                    onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Youtube className="inline h-4 w-4 mr-2" />
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    value={settings.youtubeUrl}
                    onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="https://youtube.com/@username"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan SEO</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                  placeholder="Judul untuk SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={settings.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                  placeholder="Deskripsi untuk SEO (maksimal 160 karakter)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Email</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Port
                  </label>
                  <input
                    type="text"
                    value={settings.smtpPort}
                    onChange={(e) => handleInputChange('smtpPort', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="587"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    value={settings.smtpUsername}
                    onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="username@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    value={settings.smtpPassword}
                    onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.smtpSecure}
                    onChange={(e) => handleInputChange('smtpSecure', e.target.checked)}
                    className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
                  />
                  <span className="ml-2 text-sm text-gray-700">Gunakan koneksi aman (TLS)</span>
                </label>
              </div>
            </div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Sistem</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                      className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
                    />
                    <span className="ml-2 text-sm text-gray-700">Mode Maintenance</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">Aktifkan untuk menonaktifkan situs sementara</p>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.registrationEnabled}
                      onChange={(e) => handleInputChange('registrationEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
                    />
                    <span className="ml-2 text-sm text-gray-700">Pendaftaran Terbuka</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">Izinkan pendaftaran anggota baru</p>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.emailVerificationRequired}
                      onChange={(e) => handleInputChange('emailVerificationRequired', e.target.checked)}
                      className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verifikasi Email Wajib</span>
                  </label>
                  <p className="text-xs text-gray-500 ml-6">Wajibkan verifikasi email saat pendaftaran</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ukuran Maksimal Upload (MB)
                  </label>
                  <input
                    type="number"
                    value={settings.maxFileUploadSize}
                    onChange={(e) => handleInputChange('maxFileUploadSize', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipe File yang Diizinkan
                  </label>
                  <input
                    type="text"
                    value={settings.allowedFileTypes.join(', ')}
                    onChange={(e) => handleInputChange('allowedFileTypes', e.target.value.split(', '))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    placeholder="jpg, png, pdf, doc"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Theme Tab */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Tema</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warna Primer
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                      placeholder="#dc2626"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warna Sekunder
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                      placeholder="#1f2937"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gaya Header
                  </label>
                  <select
                    value={settings.headerStyle}
                    onChange={(e) => handleInputChange('headerStyle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                  >
                    <option value="default">Default</option>
                    <option value="minimal">Minimal</option>
                    <option value="modern">Modern</option>
                    <option value="classic">Classic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gaya Footer
                  </label>
                  <select
                    value={settings.footerStyle}
                    onChange={(e) => handleInputChange('footerStyle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                  >
                    <option value="default">Default</option>
                    <option value="minimal">Minimal</option>
                    <option value="detailed">Detailed</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}