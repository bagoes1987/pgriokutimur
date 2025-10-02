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

const settingsSections = [
  {
    key: 'basic',
    name: 'Informasi Dasar',
    icon: Globe,
    description: 'Pengaturan dasar situs web'
  },
  {
    key: 'contact',
    name: 'Kontak',
    icon: Phone,
    description: 'Informasi kontak organisasi'
  },
  {
    key: 'social',
    name: 'Media Sosial',
    icon: Facebook,
    description: 'Link media sosial'
  },
  {
    key: 'seo',
    name: 'SEO',
    icon: Monitor,
    description: 'Pengaturan SEO dan analytics'
  },
  {
    key: 'email',
    name: 'Email',
    icon: Mail,
    description: 'Konfigurasi email SMTP'
  },
  {
    key: 'system',
    name: 'Sistem',
    icon: Database,
    description: 'Pengaturan sistem dan keamanan'
  },
  {
    key: 'theme',
    name: 'Tema',
    icon: Palette,
    description: 'Kustomisasi tampilan'
  }
]

export default function PengaturanPage() {
  const [activeSection, setActiveSection] = useState('basic')
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    siteKeywords: '',
    siteLogo: '',
    siteFavicon: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    facebookUrl: '',
    twitterUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    metaTitle: '',
    metaDescription: '',
    googleAnalyticsId: '',
    smtpHost: '',
    smtpPort: '',
    smtpUsername: '',
    smtpPassword: '',
    smtpSecure: true,
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    maxFileUploadSize: 5,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    primaryColor: '#dc2626',
    secondaryColor: '#1f2937',
    headerStyle: 'default',
    footerStyle: 'default'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      console.log('Fetching settings...')
      
      const response = await fetch('/api/admin/settings', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })
      
      console.log('Settings response status:', response.status)
      console.log('Settings response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.ok) {
        const data = await response.json()
        console.log('Settings data received:', data)
        console.log('Settings keys:', Object.keys(data.settings || {}))
        
        if (data.success && data.settings) {
          setSettings(prev => ({ ...prev, ...data.settings }))
          console.log('Settings updated successfully')
        } else {
          console.error('Invalid settings response structure:', data)
          toast.error('Format data pengaturan tidak valid')
        }
      } else {
        const errorText = await response.text()
        console.error('Settings API error:', response.status, errorText)
        toast.error(`Gagal memuat pengaturan (${response.status})`)
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
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        toast.success('Pengaturan berhasil disimpan')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Terjadi kesalahan saat menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (file: File, field: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', field)

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, [field]: data.url }))
        toast.success('File berhasil diupload')
      } else {
        toast.error('Gagal mengupload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      toast.error('Terjadi kesalahan saat mengupload file')
    }
  }

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const renderBasicSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nama Situs *
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => updateSetting('siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="Masukkan nama situs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deskripsi Situs
        </label>
        <textarea
          value={settings.siteDescription}
          onChange={(e) => updateSetting('siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="Deskripsi singkat tentang situs"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kata Kunci (Keywords)
        </label>
        <input
          type="text"
          value={settings.siteKeywords}
          onChange={(e) => updateSetting('siteKeywords', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="kata kunci, dipisahkan, dengan, koma"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo Situs
          </label>
          <div className="flex items-center space-x-4">
            {settings.siteLogo && (
              <img src={settings.siteLogo} alt="Logo" className="h-12 w-12 object-contain" />
            )}
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'siteLogo')}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Favicon
          </label>
          <div className="flex items-center space-x-4">
            {settings.siteFavicon && (
              <img src={settings.siteFavicon} alt="Favicon" className="h-8 w-8 object-contain" />
            )}
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Upload Favicon
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'siteFavicon')}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContactSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Kontak
        </label>
        <input
          type="email"
          value={settings.contactEmail}
          onChange={(e) => updateSetting('contactEmail', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="contact@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nomor Telepon
        </label>
        <input
          type="tel"
          value={settings.contactPhone}
          onChange={(e) => updateSetting('contactPhone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="+62 21 1234 5678"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alamat
        </label>
        <textarea
          value={settings.contactAddress}
          onChange={(e) => updateSetting('contactAddress', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="Alamat lengkap organisasi"
        />
      </div>
    </div>
  )

  const renderSocialSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Facebook URL
        </label>
        <input
          type="url"
          value={settings.facebookUrl}
          onChange={(e) => updateSetting('facebookUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="https://facebook.com/username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Twitter URL
        </label>
        <input
          type="url"
          value={settings.twitterUrl}
          onChange={(e) => updateSetting('twitterUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="https://twitter.com/username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instagram URL
        </label>
        <input
          type="url"
          value={settings.instagramUrl}
          onChange={(e) => updateSetting('instagramUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="https://instagram.com/username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          YouTube URL
        </label>
        <input
          type="url"
          value={settings.youtubeUrl}
          onChange={(e) => updateSetting('youtubeUrl', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="https://youtube.com/channel/..."
        />
      </div>
    </div>
  )

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Title
        </label>
        <input
          type="text"
          value={settings.metaTitle}
          onChange={(e) => updateSetting('metaTitle', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="Judul untuk SEO"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Meta Description
        </label>
        <textarea
          value={settings.metaDescription}
          onChange={(e) => updateSetting('metaDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
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
          onChange={(e) => updateSetting('googleAnalyticsId', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="G-XXXXXXXXXX"
        />
      </div>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Host
          </label>
          <input
            type="text"
            value={settings.smtpHost}
            onChange={(e) => updateSetting('smtpHost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            placeholder="smtp.gmail.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Port
          </label>
          <input
            type="number"
            value={settings.smtpPort}
            onChange={(e) => updateSetting('smtpPort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            placeholder="587"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SMTP Username
        </label>
        <input
          type="text"
          value={settings.smtpUsername}
          onChange={(e) => updateSetting('smtpUsername', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="username@gmail.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          SMTP Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={settings.smtpPassword}
            onChange={(e) => updateSetting('smtpPassword', e.target.value)}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            placeholder="Password atau App Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={settings.smtpSecure}
            onChange={(e) => updateSetting('smtpSecure', e.target.checked)}
            className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
          />
          <span className="ml-2 text-sm text-gray-700">Gunakan SSL/TLS</span>
        </label>
      </div>
    </div>
  )

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
              className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
            />
            <span className="ml-2 text-sm text-gray-700">Mode Maintenance</span>
          </label>
          <p className="text-xs text-gray-500 ml-6">Aktifkan untuk menonaktifkan sementara akses publik</p>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.registrationEnabled}
              onChange={(e) => updateSetting('registrationEnabled', e.target.checked)}
              className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
            />
            <span className="ml-2 text-sm text-gray-700">Pendaftaran Anggota Diaktifkan</span>
          </label>
        </div>

        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.emailVerificationRequired}
              onChange={(e) => updateSetting('emailVerificationRequired', e.target.checked)}
              className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
            />
            <span className="ml-2 text-sm text-gray-700">Verifikasi Email Diperlukan</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Maksimal Ukuran File Upload (MB)
        </label>
        <input
          type="number"
          value={settings.maxFileUploadSize}
          onChange={(e) => updateSetting('maxFileUploadSize', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          min="1"
          max="100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jenis File yang Diizinkan
        </label>
        <input
          type="text"
          value={settings.allowedFileTypes.join(', ')}
          onChange={(e) => updateSetting('allowedFileTypes', e.target.value.split(',').map(s => s.trim()))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          placeholder="jpg, png, pdf, doc, docx"
        />
        <p className="text-xs text-gray-500 mt-1">Pisahkan dengan koma</p>
      </div>
    </div>
  )

  const renderThemeSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Warna Primer
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => updateSetting('primaryColor', e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => updateSetting('primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
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
              onChange={(e) => updateSetting('secondaryColor', e.target.value)}
              className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => updateSetting('secondaryColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gaya Header
          </label>
          <select
            value={settings.headerStyle}
            onChange={(e) => updateSetting('headerStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
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
            onChange={(e) => updateSetting('footerStyle', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
          >
            <option value="default">Default</option>
            <option value="minimal">Minimal</option>
            <option value="detailed">Detailed</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeSection) {
      case 'basic': return renderBasicSettings()
      case 'contact': return renderContactSettings()
      case 'social': return renderSocialSettings()
      case 'seo': return renderSEOSettings()
      case 'email': return renderEmailSettings()
      case 'system': return renderSystemSettings()
      case 'theme': return renderThemeSettings()
      default: return renderBasicSettings()
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="h-64 bg-gray-300 rounded"></div>
              <div className="lg:col-span-3 h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Situs</h1>
          <p className="text-gray-600">Konfigurasi pengaturan sistem dan tampilan</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {settingsSections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.key}
                      onClick={() => setActiveSection(section.key)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeSection === section.key
                          ? 'bg-pgri-red text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      <div className="text-left">
                        <div>{section.name}</div>
                        <div className={`text-xs ${activeSection === section.key ? 'text-red-100' : 'text-gray-400'}`}>
                          {section.description}
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
                    {(() => {
                      const currentSection = settingsSections.find(s => s.key === activeSection);
                      if (!currentSection) return null;
                      const IconComponent = currentSection.icon;
                      return (
                        <>
                          <IconComponent className="h-6 w-6 text-pgri-red mr-3" />
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">
                              {currentSection.name}
                            </h2>
                            <p className="text-sm text-gray-600">
                              {currentSection.description}
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
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

              {/* Content */}
              <div className="px-6 py-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}