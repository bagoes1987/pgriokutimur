'use client'

import { useState, useEffect } from 'react'
import MemberLayout from '@/components/layout/MemberLayout'
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  Mail,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  job?: string
  photoPath?: string | null
}

export default function MemberPengaturan() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    job: ''
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notifications, setNotifications] = useState({
    emailNews: true,
    emailEvents: true,
    emailReminders: false,
    pushNotifications: true
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUserData(data.user)
        setProfileForm({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || '',
          job: data.user.job || ''
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const response = await fetch('/api/member/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      })

      if (response.ok) {
        alert('Profil berhasil diperbarui!')
        fetchUserData()
      } else {
        alert('Gagal memperbarui profil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Terjadi kesalahan saat memperbarui profil')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak cocok')
      return
    }

    setSaving(true)
    
    try {
      const response = await fetch('/api/member/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      })

      if (response.ok) {
        alert('Password berhasil diubah!')
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        const data = await response.json()
        alert(data.message || 'Gagal mengubah password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Terjadi kesalahan saat mengubah password')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'password', name: 'Keamanan', icon: Lock },
    { id: 'notifications', name: 'Notifikasi', icon: Bell },
    { id: 'privacy', name: 'Privasi', icon: Shield }
  ]

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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pengaturan</h1>
          <p className="text-gray-600">Kelola profil dan preferensi akun Anda</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-pgri-red text-pgri-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informasi Profil</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-1" />
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Briefcase className="h-4 w-4 inline mr-1" />
                        Pekerjaan
                      </label>
                      <input
                        type="text"
                        value={profileForm.job}
                        onChange={(e) => setProfileForm({...profileForm, job: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Alamat
                    </label>
                    <textarea
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-pgri-red text-white rounded-lg hover:bg-pgri-red-dark disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Ubah Password</h3>
                  
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Saat Ini
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konfirmasi Password Baru
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-pgri-red text-white rounded-lg hover:bg-pgri-red-dark disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Menyimpan...' : 'Ubah Password'}</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preferensi Notifikasi</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Berita PGRI</h4>
                        <p className="text-sm text-gray-500">Terima notifikasi email untuk berita terbaru</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailNews}
                          onChange={(e) => setNotifications({...notifications, emailNews: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pgri-red"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Kegiatan & Acara</h4>
                        <p className="text-sm text-gray-500">Terima notifikasi untuk kegiatan dan acara PGRI</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailEvents}
                          onChange={(e) => setNotifications({...notifications, emailEvents: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pgri-red"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Pengingat</h4>
                        <p className="text-sm text-gray-500">Terima pengingat untuk deadline dan tugas penting</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.emailReminders}
                          onChange={(e) => setNotifications({...notifications, emailReminders: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pgri-red"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Notifikasi Push</h4>
                        <p className="text-sm text-gray-500">Terima notifikasi langsung di browser</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.pushNotifications}
                          onChange={(e) => setNotifications({...notifications, pushNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pgri-red"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    className="flex items-center space-x-2 px-4 py-2 bg-pgri-red text-white rounded-lg hover:bg-pgri-red-dark"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan Preferensi</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Pengaturan Privasi</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Visibilitas Profil</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Kontrol siapa yang dapat melihat informasi profil Anda di direktori anggota.
                      </p>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pgri-red focus:border-transparent">
                        <option value="public">Publik - Semua anggota dapat melihat</option>
                        <option value="members">Anggota - Hanya anggota PGRI yang dapat melihat</option>
                        <option value="private">Privat - Hanya admin yang dapat melihat</option>
                      </select>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Data Aktivitas</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Kelola bagaimana data aktivitas Anda disimpan dan digunakan.
                      </p>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">Simpan riwayat login</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-pgri-red focus:ring-pgri-red" defaultChecked />
                          <span className="ml-2 text-sm text-gray-700">Simpan riwayat aktivitas</span>
                        </label>
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="text-sm font-medium text-red-900 mb-2">Zona Bahaya</h4>
                      <p className="text-sm text-red-700 mb-3">
                        Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.
                      </p>
                      <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                        Hapus Akun
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MemberLayout>
  )
}