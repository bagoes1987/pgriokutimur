'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { 
  User,
  Lock,
  Bell,
  Shield,
  Save,
  Upload,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  AlertCircle,
  Check,
  X
} from 'lucide-react'

interface AdminProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  position: string
  department: string
  joinDate: string
  lastLogin: string
  isActive: boolean
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  sessionTimeout: number
  passwordExpiry: number
  loginAttempts: number
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  memberRegistration: boolean
  newsPublished: boolean
  systemAlerts: boolean
  weeklyReports: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<AdminProfile>({
    id: '',
    name: '',
    email: '',
    phone: '',
    avatar: '',
    position: '',
    department: '',
    joinDate: '',
    lastLogin: '',
    isActive: true
  })
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5
  })
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    memberRegistration: true,
    newsPublished: true,
    systemAlerts: true,
    weeklyReports: false
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)
        setSecuritySettings(data.security)
        setNotificationSettings(data.notifications)
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

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      })

      if (response.ok) {
        toast.success('Profil berhasil diperbarui')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Gagal memperbarui profil')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Terjadi kesalahan saat menyimpan profil')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })

      if (response.ok) {
        toast.success('Password berhasil diubah')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const data = await response.json()
        toast.error(data.message || 'Gagal mengubah password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Terjadi kesalahan saat mengubah password')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async (type: 'security' | 'notifications') => {
    try {
      setSaving(true)
      const data = type === 'security' ? securitySettings : notificationSettings
      
      const response = await fetch(`/api/admin/settings/${type}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success(`Pengaturan ${type === 'security' ? 'keamanan' : 'notifikasi'} berhasil disimpan`)
      } else {
        const result = await response.json()
        toast.error(result.message || 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Terjadi kesalahan saat menyimpan pengaturan')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'avatar')

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(prev => ({ ...prev, avatar: data.url }))
        toast.success('Avatar berhasil diupload')
      } else {
        toast.error('Gagal mengupload avatar')
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error('Terjadi kesalahan saat mengupload avatar')
    }
  }

  const tabs = [
    { key: 'profile', name: 'Profil', icon: User },
    { key: 'password', name: 'Password', icon: Lock },
    { key: 'security', name: 'Keamanan', icon: Shield },
    { key: 'notifications', name: 'Notifikasi', icon: Bell }
  ]

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-pgri-red text-white rounded-full p-2 cursor-pointer hover:bg-red-700">
            <Camera className="h-4 w-4" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{profile.name || 'Nama Admin'}</h3>
          <p className="text-sm text-gray-600">{profile.position || 'Administrator'}</p>
          <p className="text-sm text-gray-500">Bergabung: {profile.joinDate ? new Date(profile.joinDate).toLocaleDateString('id-ID') : '-'}</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Lengkap *
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            placeholder="Masukkan nama lengkap"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            placeholder="+62 812 3456 7890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jabatan
          </label>
          <input
            type="text"
            value={profile.position}
            onChange={(e) => setProfile(prev => ({ ...prev, position: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            placeholder="Administrator Sistem"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departemen
          </label>
          <input
            type="text"
            value={profile.department}
            onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            placeholder="IT Department"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pgri-red hover:bg-red-700 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </div>
    </div>
  )

  const renderPasswordTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Keamanan Password</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Gunakan minimal 8 karakter</li>
                <li>Kombinasikan huruf besar, kecil, angka, dan simbol</li>
                <li>Jangan gunakan informasi pribadi</li>
                <li>Ganti password secara berkala</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Saat Ini *
          </label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
              placeholder="Masukkan password saat ini"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.current ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Baru *
          </label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
              placeholder="Masukkan password baru"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.new ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konfirmasi Password Baru *
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
              placeholder="Konfirmasi password baru"
            />
            <button
              type="button"
              onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleChangePassword}
          disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pgri-red hover:bg-red-700 disabled:opacity-50"
        >
          <Lock className="h-4 w-4 mr-2" />
          {saving ? 'Mengubah...' : 'Ubah Password'}
        </button>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
            <p className="text-sm text-gray-600">Tambahan keamanan dengan kode verifikasi</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={securitySettings.twoFactorEnabled}
              onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pgri-red"></div>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Session Timeout (menit)
          </label>
          <input
            type="number"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            min="5"
            max="480"
          />
          <p className="text-xs text-gray-500 mt-1">Otomatis logout setelah tidak aktif</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password Expiry (hari)
          </label>
          <input
            type="number"
            value={securitySettings.passwordExpiry}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            min="30"
            max="365"
          />
          <p className="text-xs text-gray-500 mt-1">Wajib ganti password setelah periode ini</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Login Attempts
          </label>
          <input
            type="number"
            value={securitySettings.loginAttempts}
            onChange={(e) => setSecuritySettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pgri-red focus:border-transparent"
            min="3"
            max="10"
          />
          <p className="text-xs text-gray-500 mt-1">Blokir akun setelah gagal login berkali-kali</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSaveSettings('security')}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pgri-red hover:bg-red-700 disabled:opacity-50"
        >
          <Shield className="h-4 w-4 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pgri-red"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-600">Notifikasi real-time di browser</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.pushNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pgri-red"></div>
          </label>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Jenis Notifikasi</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.memberRegistration}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, memberRegistration: e.target.checked }))}
                className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
              />
              <span className="ml-2 text-sm text-gray-700">Pendaftaran anggota baru</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.newsPublished}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, newsPublished: e.target.checked }))}
                className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
              />
              <span className="ml-2 text-sm text-gray-700">Berita dipublikasi</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.systemAlerts}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, systemAlerts: e.target.checked }))}
                className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
              />
              <span className="ml-2 text-sm text-gray-700">Alert sistem</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={notificationSettings.weeklyReports}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, weeklyReports: e.target.checked }))}
                className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red"
              />
              <span className="ml-2 text-sm text-gray-700">Laporan mingguan</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSaveSettings('notifications')}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pgri-red hover:bg-red-700 disabled:opacity-50"
        >
          <Bell className="h-4 w-4 mr-2" />
          {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
        </button>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab()
      case 'password': return renderPasswordTab()
      case 'security': return renderSecurityTab()
      case 'notifications': return renderNotificationsTab()
      default: return renderProfileTab()
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Akun</h1>
          <p className="text-gray-600">Kelola profil dan pengaturan akun admin</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-pgri-red text-pgri-red'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {renderContent()}
        </div>
      </div>
    </AdminLayout>
  )
}