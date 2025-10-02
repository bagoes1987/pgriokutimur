'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import PublicLayout from '@/components/layout/PublicLayout'
import toast from 'react-hot-toast'
import { 
  User, 
  Mail, 
  Lock, 
  Calendar, 
  MapPin, 
  Phone, 
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface FormData {
  // Login credentials
  email: string
  password: string
  confirmPassword: string
  
  // Personal data
  oldNpa?: string
  nik: string
  name: string
  birthPlace: string
  birthDate: string
  gender: string
  religionId: number
  bloodType?: string
  address: string
  postalCode: string
  phoneNumber: string
  photo?: FileList
  
  // Work data
  provinceId: number
  regencyId: number
  districtId: number
  village?: string
  institutionName: string
  workAddress: string
  jobId: number
  educationId: number
  employeeStatusId: number
  rank?: string
  hasEducatorCert: boolean
  teachingLevels: number[]
  subjects?: string
}

interface MasterData {
  religions: Array<{ id: number; name: string }>
  provinces: Array<{ id: number; name: string }>
  regencies: Array<{ id: number; name: string }>
  districts: Array<{ id: number; name: string }>
  villages: Array<{ id: number; name: string }>
  jobs: Array<{ id: number; name: string }>
  educations: Array<{ id: number; name: string }>
  employeeStatuses: Array<{ id: number; name: string }>
  teachingLevels: Array<{ id: number; name: string }>
}

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [masterData, setMasterData] = useState<MasterData>({
    religions: [],
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
    jobs: [],
    educations: [],
    employeeStatuses: [],
    teachingLevels: []
  })
  const [loading, setLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<FormData>()

  const watchedDistrict = watch('districtId')
  const watchedPhoto = watch('photo')

  useEffect(() => {
    fetchMasterData()
  }, [])

  useEffect(() => {
    if (watchedDistrict) {
      fetchVillages(watchedDistrict)
    }
  }, [watchedDistrict])

  useEffect(() => {
    if (watchedPhoto && watchedPhoto[0]) {
      const file = watchedPhoto[0]
      if (file.size > 1024 * 1024) { // 1MB
        toast.error('Ukuran file foto maksimal 1MB')
        setValue('photo', undefined)
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [watchedPhoto, setValue])

  const fetchMasterData = async () => {
    try {
      const response = await fetch('/api/public/master-data')
      if (response.ok) {
        const data = await response.json()
        setMasterData(data)
      }
    } catch (error) {
      console.error('Error fetching master data:', error)
      toast.error('Gagal memuat data master')
    }
  }

  const fetchVillages = async (districtId: number) => {
    try {
      const response = await fetch(`/api/public/villages?districtId=${districtId}`)
      if (response.ok) {
        const data = await response.json()
        setMasterData(prev => ({ ...prev, villages: data.villages || [] }))
      } else {
        setMasterData(prev => ({ ...prev, villages: [] }))
      }
    } catch (error) {
      console.error('Error fetching villages:', error)
      setMasterData(prev => ({ ...prev, villages: [] }))
    }
  }

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted with data:', data)
    console.log('Form errors:', errors)
    console.log('Form validation state:', Object.keys(errors).length === 0 ? 'Valid' : 'Invalid')
    
    // Check teachingLevels specifically
    console.log('Teaching levels data:', data.teachingLevels)
    console.log('Teaching levels type:', typeof data.teachingLevels)
    console.log('Teaching levels length:', Array.isArray(data.teachingLevels) ? data.teachingLevels.length : 'Not an array')
    
    // Validate step 2 fields before submitting
    const step2Fields = [
      'provinceId', 'regencyId', 'districtId', 'institutionName', 
      'workAddress', 'jobId', 'educationId', 'employeeStatusId', 'hasEducatorCert', 
      'teachingLevels'
    ]
    
    const isStep2Valid = await trigger(step2Fields as any)
    
    if (!isStep2Valid) {
      console.log('Step 2 validation failed. Current errors:', errors)
      toast.error('Mohon lengkapi semua field yang wajib diisi')
      return
    }
    
    // Additional validation for teachingLevels
    if (!data.teachingLevels || !Array.isArray(data.teachingLevels) || data.teachingLevels.length === 0) {
      toast.error('Mohon pilih minimal satu jenjang mengajar')
      return
    }
    
    if (data.password !== data.confirmPassword) {
      toast.error('Password dan konfirmasi password tidak sama')
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      
      console.log('Creating FormData with data:', data)
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        console.log(`Processing field: ${key} = ${value} (type: ${typeof value})`)
        
        if (key === 'photo' && value && value[0]) {
          console.log('Adding photo file:', value[0])
          formData.append('photo', value[0])
        } else if (key === 'teachingLevels' && Array.isArray(value)) {
          console.log('Adding teachingLevels as JSON:', JSON.stringify(value))
          formData.append('teachingLevels', JSON.stringify(value))
        } else if (value !== undefined && value !== null && key !== 'confirmPassword') {
          console.log(`Adding field ${key}:`, value.toString())
          formData.append(key, value.toString())
        }
      })
      
      // Log FormData contents
      console.log('FormData entries:')
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(`  ${key}:`, `File(${value.name}, ${value.size} bytes)`)
        } else {
          console.log(`  ${key}:`, value)
        }
      })

      const response = await fetch('/api/public/register', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (response.ok) {
        if (result.autoLogin) {
          toast.success('Pendaftaran berhasil! Anda akan langsung masuk ke dashboard anggota.')
          router.push('/member/dashboard')
        } else {
          toast.success('Pendaftaran berhasil! Silakan login untuk masuk ke dashboard.')
          router.push('/login')
        }
      } else {
        toast.error(result.error || 'Gagal mendaftar')
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Terjadi kesalahan saat mendaftar')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = async () => {
    // Validate step 1 fields before proceeding
    const step1Fields = [
      'email', 'password', 'confirmPassword', 'nik', 'name', 'birthPlace', 
      'birthDate', 'gender', 'religionId', 'address', 'postalCode', 'phoneNumber', 'photo'
    ]
    
    const isStep1Valid = await trigger(step1Fields as any)
    
    if (isStep1Valid && currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pendaftaran Anggota PGRI
            </h1>
            <p className="text-lg text-gray-600">
              Lengkapi formulir berikut untuk mendaftar sebagai anggota PGRI OKU Timur
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-pgri-red' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-pgri-red text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
                </div>
                <span className="ml-2 font-medium">Data Pribadi</span>
              </div>
              
              <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-pgri-red' : 'bg-gray-300'}`}></div>
              
              <div className={`flex items-center ${currentStep >= 2 ? 'text-pgri-red' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-pgri-red text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  2
                </div>
                <span className="ml-2 font-medium">Data Pekerjaan</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2 text-pgri-red" />
                  Data Pribadi
                </h2>

                {/* Login Credentials */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Login <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email harus diisi',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Format email tidak valid'
                          }
                        })}
                        className="input-field-with-icon"
                        placeholder="contoh@gmail.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', { 
                          required: 'Password harus diisi',
                          minLength: {
                            value: 8,
                            message: 'Password minimal 8 karakter'
                          }
                        })}
                        className="input-field-with-icon pr-10"
                        placeholder="Minimal 8 karakter"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konfirmasi Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...register('confirmPassword', { 
                          required: 'Konfirmasi password harus diisi'
                        })}
                        className="input-field-with-icon pr-10"
                        placeholder="Ulangi password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NPA
                    </label>
                    <input
                      type="text"
                      {...register('oldNpa')}
                      className="input-field text-sm"
                      placeholder="Tidak Wajib (Hanya Yang Sudah Memiliki KTA)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NIK <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('nik', { 
                        required: 'NIK harus diisi',
                        pattern: {
                          value: /^\d{16}$/,
                          message: 'NIK harus 16 digit angka'
                        }
                      })}
                      className="input-field"
                      placeholder="16 digit NIK"
                      maxLength={16}
                    />
                    {errors.nik && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.nik.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name', { required: 'Nama harus diisi' })}
                    className="input-field"
                    placeholder="Nama lengkap dengan gelar (jika ada)"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tempat Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register('birthPlace', { required: 'Tempat lahir harus diisi' })}
                      className="input-field"
                      placeholder="Kota/Kabupaten lahir"
                    />
                    {errors.birthPlace && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.birthPlace.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="date"
                        {...register('birthDate', { required: 'Tanggal lahir harus diisi' })}
                        className="input-field-with-icon"
                      />
                    </div>
                    {errors.birthDate && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.birthDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('gender', { required: 'Jenis kelamin harus dipilih' })}
                      className="input-field"
                    >
                      <option value="">Pilih jenis kelamin</option>
                      <option value="Laki-Laki">Laki-Laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agama <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('religionId', { 
                        required: 'Agama harus dipilih',
                        valueAsNumber: true 
                      })}
                      className="input-field"
                    >
                      <option value="">Pilih agama</option>
                      {masterData.religions.map((religion) => (
                        <option key={religion.id} value={religion.id}>
                          {religion.name}
                        </option>
                      ))}
                    </select>
                    {errors.religionId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.religionId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Golongan Darah
                    </label>
                    <select
                      {...register('bloodType')}
                      className="input-field"
                    >
                      <option value="">Pilih golongan darah</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                      <option value="Tidak Tahu">Tidak Tahu</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat (Sesuai KTP) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('address', { required: 'Alamat harus diisi' })}
                    className="input-field"
                    rows={3}
                    placeholder="Alamat lengkap sesuai KTP"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kode Pos <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        {...register('postalCode', { required: 'Kode pos harus diisi' })}
                        className="input-field-with-icon"
                        placeholder="Kode pos"
                        maxLength={5}
                      />
                    </div>
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.postalCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor HP <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        {...register('phoneNumber', { 
                          required: 'Nomor HP harus diisi',
                          pattern: {
                            value: /^(\+62|62|0)[0-9]{9,13}$/,
                            message: 'Format nomor HP tidak valid'
                          }
                        })}
                        className="input-field-with-icon"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Profil <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-pgri-red transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      {photoPreview ? (
                        <div className="mb-4">
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="mx-auto h-32 w-24 object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      )}
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-pgri-red hover:text-pgri-red-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pgri-red">
                          <span>Upload foto</span>
                          <input
                            type="file"
                            {...register('photo', { required: 'Foto harus diupload' })}
                            className="sr-only"
                            accept="image/jpeg,image/jpg,image/png"
                          />
                        </label>
                        <p className="pl-1">atau drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, JPEG maksimal 1MB<br />
                        Ukuran 3x4 cm, memakai baju PGRI
                      </p>
                    </div>
                  </div>
                  {errors.photo && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.photo.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Lanjut ke Data Pekerjaan
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-pgri-red" />
                  Data Pekerjaan
                </h2>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Provinsi <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('provinceId', { 
                        required: 'Provinsi harus dipilih',
                        valueAsNumber: true 
                      })}
                      className="input-field"
                    >
                      <option value="">Pilih provinsi</option>
                      {masterData.provinces.map((province) => (
                        <option key={province.id} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </select>
                    {errors.provinceId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.provinceId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kabupaten <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('regencyId', { 
                        required: 'Kabupaten harus dipilih',
                        valueAsNumber: true 
                      })}
                      className="input-field"
                    >
                      <option value="">Pilih kabupaten</option>
                      {masterData.regencies.map((regency) => (
                        <option key={regency.id} value={regency.id}>
                          {regency.name}
                        </option>
                      ))}
                    </select>
                    {errors.regencyId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.regencyId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kecamatan <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('districtId', { 
                        required: 'Kecamatan harus dipilih',
                        valueAsNumber: true 
                      })}
                      className="input-field"
                    >
                      <option value="">Pilih kecamatan</option>
                      {masterData.districts.map((district) => (
                        <option key={district.id} value={district.id}>
                          {district.name}
                        </option>
                      ))}
                    </select>
                    {errors.districtId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.districtId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Desa/Kelurahan
                    </label>
                    <input
                      type="text"
                      {...register('village')}
                      className="input-field"
                      placeholder="Ketik nama desa/kelurahan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Instansi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('institutionName', { required: 'Nama instansi harus diisi' })}
                    className="input-field"
                    placeholder="Nama sekolah/instansi tempat bekerja"
                  />
                  {errors.institutionName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.institutionName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alamat Tempat Kerja <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('workAddress', { required: 'Alamat tempat kerja harus diisi' })}
                    className="input-field"
                    rows={3}
                    placeholder="Alamat lengkap tempat bekerja"
                  />
                  {errors.workAddress && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.workAddress.message}
                    </p>
                  )}
                </div>

                {/* Job Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pekerjaan <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('jobId', { 
                        required: 'Pekerjaan harus dipilih',
                        valueAsNumber: true 
                      })}
                      className="input-field"
                    >
                      <option value="">Pilih pekerjaan</option>
                      {masterData.jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.name}
                        </option>
                      ))}
                    </select>
                    {errors.jobId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.jobId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pendidikan Terakhir <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('educationId', { 
                        required: 'Pendidikan harus dipilih',
                        valueAsNumber: true 
                      })}
                      className="input-field"
                    >
                      <option value="">Pilih pendidikan</option>
                      {masterData.educations.map((education) => (
                        <option key={education.id} value={education.id}>
                          {education.name}
                        </option>
                      ))}
                    </select>
                    {errors.educationId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.educationId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status Pegawai <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register('employeeStatusId', { 
                        required: 'Status pegawai harus dipilih',
                        valueAsNumber: true 
                      })}
                      className="input-field"
                    >
                      <option value="">Pilih status pegawai</option>
                      {masterData.employeeStatuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.name}
                        </option>
                      ))}
                    </select>
                    {errors.employeeStatusId && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.employeeStatusId.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pangkat/Golongan
                    </label>
                    <input
                      type="text"
                      {...register('rank')}
                      className="input-field"
                      placeholder="Jika tidak ada, isi dengan tanda -"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sertifikat Pendidik <span className="text-red-500">*</span>
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('hasEducatorCert', { required: 'Status sertifikat harus dipilih' })}
                        value="true"
                        className="mr-2"
                      />
                      Sudah
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register('hasEducatorCert', { required: 'Status sertifikat harus dipilih' })}
                        value="false"
                        className="mr-2"
                      />
                      Belum
                    </label>
                  </div>
                  {errors.hasEducatorCert && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.hasEducatorCert.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jenjang Mengajar <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {masterData.teachingLevels.map((level) => (
                      <label key={level.id} className="flex items-center">
                        <input
                          type="checkbox"
                          {...register('teachingLevels', { required: 'Minimal pilih satu jenjang mengajar' })}
                          value={level.id}
                          className="mr-2"
                        />
                        {level.name}
                      </label>
                    ))}
                  </div>
                  {errors.teachingLevels && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.teachingLevels.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mata Pelajaran
                  </label>
                  <textarea
                    {...register('subjects')}
                    className="input-field"
                    rows={3}
                    placeholder="Sebutkan mata pelajaran yang diampu (opsional)"
                  />
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-outline"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </PublicLayout>
  )
}