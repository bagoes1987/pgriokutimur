'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import MemberLayout from '@/components/layout/MemberLayout';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Camera, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  CheckCircle,
  QrCode,
  Printer
} from 'lucide-react';
import QRCodeLib from 'qrcode';

interface MemberData {
  id: string;
  name: string;
  email: string;
  npa?: string;
  oldNpa?: string;
  nik?: string;
  birthPlace?: string;
  birthDate?: string;
  gender?: string;
  bloodType?: string;
  phoneNumber?: string;
  address?: string;
  village?: string;
  postalCode?: string;
  institutionName?: string;
  rank?: string;
  workAddress?: string;
  hasEducatorCert?: boolean;
  subjects?: string;
  photo?: string;
  createdAt: string;
  religion?: { name: string };
  province?: { name: string };
  regency?: { name: string };
  district?: { name: string };
  job?: { name: string };
  employeeStatus?: { name: string };
  education?: { name: string };
  teachingLevels?: { name: string }[];
  phone?: string;
  religionId?: string;
  provinceId?: string;
  regencyId?: string;
  districtId?: string;
  jobId?: string;
  employeeStatusId?: string;
  educationId?: string;
}

interface DropdownOption {
  id: string;
  name: string;
}

export default function BiodataPage() {
  const router = useRouter();
  const [memberData, setMemberData] = useState<MemberData>(() => {
    // Initialize with photo from localStorage if available
    let initialPhoto = undefined;
    if (typeof window !== 'undefined') {
      const savedPhoto = localStorage.getItem('memberPhoto');
      if (savedPhoto) {
        console.log('🚀 BIODATA INIT: Using saved photo from localStorage:', savedPhoto);
        initialPhoto = savedPhoto;
      }
    }
    
    return {
      id: '',
      name: '',
      email: '',
      createdAt: '',
      photo: initialPhoto
    };
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);



  // Form data state
  const [formData, setFormData] = useState<Partial<MemberData>>({});

  // Dropdown options
  const [religions, setReligions] = useState<DropdownOption[]>([]);
  const [provinces, setProvinces] = useState<DropdownOption[]>([]);
  const [regencies, setRegencies] = useState<DropdownOption[]>([]);
  const [districts, setDistricts] = useState<DropdownOption[]>([]);
  const [jobs, setJobs] = useState<DropdownOption[]>([]);
  const [employeeStatuses, setEmployeeStatuses] = useState<DropdownOption[]>([]);
  const [educations, setEducations] = useState<DropdownOption[]>([]);
  const [teachingLevels, setTeachingLevels] = useState<DropdownOption[]>([]);
  const [selectedTeachingLevels, setSelectedTeachingLevels] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'pribadi' | 'pekerjaan'>('pribadi');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  useEffect(() => {
    fetchMemberData();
    fetchDropdownData();
  }, []);



  useEffect(() => {
    if (memberData.id) {
      generateQRCode();
    }
  }, [memberData.id]);

  const generateQRCode = useCallback(async () => {
    try {
      const qrData = `Nama: ${memberData.name}
NPA: ${memberData.npa || memberData.oldNpa}
Email: ${memberData.email}`;
      const qrString = await QRCodeLib.toDataURL(qrData);
      setQrCodeUrl(qrString);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }, [memberData.name, memberData.npa, memberData.oldNpa, memberData.email]);

  const handlePrintBiodata = async () => {
    try {
      const response = await fetch('/api/member/biodata/download');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Biodata_${memberData.name?.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Gagal mengunduh biodata');
      }
    } catch (error) {
      console.error('Error downloading biodata:', error);
      alert('Terjadi kesalahan saat mengunduh biodata');
    }
  };

  const fetchMemberData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      
      const response = await fetch('/api/member/biodata');
      if (response.ok) {
        const data = await response.json();
        console.log('📥 FETCH RESPONSE: Full API response:', data);
        console.log('📥 FETCH RESPONSE: Member photo path:', data.member?.photo);
        if (data.success && data.member) {
          console.log('📝 UPDATING STATE: Setting memberData with photo:', data.member.photo);
          setMemberData(data.member);
          setFormData(data.member);
          
          // Save photo to localStorage for persistence
          if (data.member.photo) {
            localStorage.setItem('memberPhoto', data.member.photo);
            console.log('💾 LOCALSTORAGE: Saved photo to localStorage:', data.member.photo);
          }
          
          if (data.member.teachingLevels) {
            setSelectedTeachingLevels(data.member.teachingLevels.map((tl: any) => tl.id));
          }
        } else {
          console.error('Invalid response format:', data);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch member data:', errorData);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [
        religionsRes,
        provincesRes,
        jobsRes,
        employeeStatusesRes,
        educationsRes,
        teachingLevelsRes
      ] = await Promise.all([
        fetch('/api/master/religions'),
        fetch('/api/master/provinces'),
        fetch('/api/master/jobs'),
        fetch('/api/master/employee-statuses'),
        fetch('/api/master/educations'),
        fetch('/api/master/teaching-levels')
      ]);

      if (religionsRes.ok) {
        const religionsData = await religionsRes.json();
        setReligions(religionsData);
      }

      if (provincesRes.ok) {
        const provincesData = await provincesRes.json();
        setProvinces(provincesData);
      }

      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
      }

      if (employeeStatusesRes.ok) {
        const employeeStatusesData = await employeeStatusesRes.json();
        setEmployeeStatuses(employeeStatusesData);
      }

      if (educationsRes.ok) {
        const educationsData = await educationsRes.json();
        setEducations(educationsData);
      }

      if (teachingLevelsRes.ok) {
        const teachingLevelsData = await teachingLevelsRes.json();
        setTeachingLevels(teachingLevelsData);
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
    }
  }, []);

  const handleProvinceChange = useCallback(async (provinceId: string) => {
    setFormData({...formData, provinceId, regencyId: '', districtId: ''});
    setRegencies([]);
    setDistricts([]);

    if (provinceId) {
      try {
        const response = await fetch(`/api/master/regencies?provinceId=${provinceId}`);
        if (response.ok) {
          const data = await response.json();
          setRegencies(data);
        }
      } catch (error) {
        console.error('Error fetching regencies:', error);
      }
    }
  }, [formData]);

  const handleRegencyChange = useCallback(async (regencyId: string) => {
    setFormData({...formData, regencyId, districtId: ''});
    setDistricts([]);

    if (regencyId) {
      try {
        const response = await fetch(`/api/master/districts?regencyId=${regencyId}`);
        if (response.ok) {
          const data = await response.json();
          setDistricts(data);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    }
  }, [formData]);

  const handlePhotoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2MB');
        return;
      }

      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Format file harus JPG, JPEG, atau PNG');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      if (photoFile) {
        formDataToSend.append('photo', photoFile);
      }

      formDataToSend.append('teachingLevels', JSON.stringify(selectedTeachingLevels));

      const response = await fetch('/api/member/biodata', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedData = await response.json();
        console.log('💾 SAVE SUCCESS: Updated data from PUT API:', updatedData);
        
        // Refresh data from server FIRST to get the latest photo path
        console.log('🔄 REFRESHING: About to call fetchMemberData...');
        await fetchMemberData(true);
        console.log('✅ REFRESH COMPLETE: fetchMemberData finished');
        
        // Show success message first
        alert('Biodata berhasil diperbarui');
        
        // Exit edit mode AFTER alert to ensure proper state transition
        setEditMode(false);
        
        // Clear photo file but keep preview until next edit to prevent flickering
        setPhotoFile(null);
        // DON'T clear photoPreview immediately - let it be cleared when entering edit mode next time
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Gagal memperbarui biodata');
      }
    } catch (error) {
      console.error('Error updating biodata:', error);
      alert('Terjadi kesalahan saat memperbarui biodata');
    } finally {
      setSaving(false);
    }
  }, [formData, photoFile, selectedTeachingLevels, fetchMemberData]);

  const handleEditMode = useCallback(() => {
    console.log('🔧 EDIT MODE: Entering edit mode, clearing photoPreview...');
    setEditMode(true);
    setPhotoPreview(null); // Clear any previous photo preview when entering edit mode
    setPhotoFile(null);
  }, []);

  const handleCancel = useCallback(() => {
    setFormData(memberData);
    setEditMode(false);
    setPhotoFile(null);
    setPhotoPreview(null);
    if (memberData.teachingLevels) {
      setSelectedTeachingLevels(memberData.teachingLevels.map((tl: any) => tl.id));
    }
  }, [memberData]);

  // Memoized computed values
  const displayName = useMemo(() => {
    return memberData.name || '-';
  }, [memberData.name]);

  const displayPhoto = useMemo(() => {
    // Priority 1: Photo preview saat edit mode
    if (editMode && photoPreview) {
      console.log('🖼️ DISPLAY PHOTO: Using photoPreview (edit mode)');
      return photoPreview;
    }
    
    // Priority 2: Member photo (langsung dari API tanpa modifikasi)
    if (memberData?.photo) {
      console.log('🖼️ DISPLAY PHOTO: Using member photo directly from API =', memberData.photo);
      // Tambahkan cache busting untuk mencegah cache browser
      const timestamp = new Date().getTime();
      return `${memberData.photo}?t=${timestamp}`;
    }
    
    // Priority 3: Tidak ada foto
    console.log('🖼️ DISPLAY PHOTO: No photo available');
    return null;
  }, [editMode, photoPreview, memberData?.photo]);

  const isFormValid = useMemo(() => {
    return formData.name && formData.phoneNumber && formData.address && 
           formData.institutionName && formData.workAddress;
  }, [formData.name, formData.phoneNumber, formData.address, formData.institutionName, formData.workAddress]);

  if (loading) {
    return (
      <MemberLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pgri-red"></div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="min-h-screen bg-gray-50 py-8 relative">
        {/* Loading Overlay */}
        {refreshing && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pgri-red mx-auto mb-4"></div>
              <p className="text-gray-600">Memperbarui data...</p>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Biodata Anggota</h1>
                <p className="mt-2 text-gray-600">Kelola informasi pribadi dan profesional Anda</p>
              </div>
              <div className="flex space-x-3">
                {!editMode ? (
                  <button
                    onClick={handleEditMode}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pgri-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pgri-red"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Biodata
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={saving || refreshing}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {(saving || refreshing) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      {saving ? 'Menyimpan...' : refreshing ? 'Memperbarui...' : 'Simpan'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pgri-red"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content - Card Style Layout */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex justify-between items-center">
                <nav className="-mb-px flex">
                  <button 
                    onClick={() => setActiveTab('pribadi')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'pribadi' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    DATA PRIBADI
                  </button>
                  <button 
                    onClick={() => setActiveTab('pekerjaan')}
                    className={`py-4 px-6 border-b-2 font-medium text-sm ${
                      activeTab === 'pekerjaan' 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    DATA PEKERJAAN
                  </button>
                </nav>
                
                {/* Print Biodata Button */}
                <div className="pr-6">
                  <button
                    onClick={handlePrintBiodata}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Cetak Biodata
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              {activeTab === 'pribadi' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left Column - Photo and Basic Info */}
                  <div className="lg:col-span-1">
                  <div className="text-center">
                    {/* Photo */}
                    <div className="relative inline-block mb-6">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Preview"
                          className="w-48 h-64 object-cover rounded-lg border-4 border-red-500"
                          onError={(e) => {
                            console.error('❌ PHOTO ERROR: Failed to load photoPreview:', photoPreview);
                            setPhotoPreview(null);
                          }}
                        />
                      ) : displayPhoto ? (
                        <img
                          src={displayPhoto}
                          alt={memberData.name}
                          className="w-48 h-64 object-cover rounded-lg border-4 border-red-500"
                          onError={(e) => {
                            console.error('❌ PHOTO ERROR: Failed to load displayPhoto:', displayPhoto);
                            console.error('❌ PHOTO ERROR: Original memberData.photo:', memberData.photo);
                          }}
                          onLoad={() => {
                            console.log('✅ PHOTO SUCCESS: Successfully loaded displayPhoto:', displayPhoto);
                          }}
                        />
                      ) : (
                        <div className="w-48 h-64 bg-red-500 rounded-lg flex items-center justify-center border-4 border-red-500">
                          <User className="h-24 w-24 text-white" />
                        </div>
                      )}
                      {editMode && (
                        <label className="absolute bottom-2 right-2 bg-pgri-red text-white p-2 rounded-full hover:bg-red-700 cursor-pointer">
                          <Camera className="h-4 w-4" />
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handlePhotoChange}
                            className="sr-only"
                          />
                        </label>
                      )}
                    </div>

                    {/* Name and Title */}
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {memberData.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        NPA: {memberData.npa || memberData.oldNpa || '-'}
                      </p>
                    </div>

                    {/* Basic Stats */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">NPA</span>
                        <span className="text-gray-900">{memberData.npa || memberData.oldNpa || '-'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-700">Status</span>
                        <span className="flex items-center text-blue-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Terverifikasi
                        </span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="mb-6">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                        {qrCodeUrl ? (
                          <img src={qrCodeUrl} alt="QR Code" className="w-full h-full rounded-lg" />
                        ) : (
                          <QrCode className="h-16 w-16 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">QR Code Anggota</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Detailed Information */}
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">EMAIL</label>
                      <div className="text-sm text-gray-900">{memberData.email || '-'}</div>
                    </div>

                    {/* NPA */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NPA</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.npa || formData.oldNpa || ''}
                          onChange={(e) => setFormData({...formData, npa: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{memberData.npa || memberData.oldNpa || '-'}</div>
                      )}
                    </div>

                    {/* NIK */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.nik || ''}
                          onChange={(e) => setFormData({...formData, nik: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{memberData.nik || '-'}</div>
                      )}
                    </div>

                    {/* Nama */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        />
                      ) : (
                        <div className="text-sm text-gray-900 font-medium">{memberData.name || '-'}</div>
                      )}
                    </div>

                    {/* Tempat Lahir */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tempat lahir</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.birthPlace || ''}
                          onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{memberData.birthPlace || '-'}</div>
                      )}
                    </div>

                    {/* Tanggal Lahir */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal lahir</label>
                      {editMode ? (
                        <input
                          type="date"
                          value={formData.birthDate || ''}
                          onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {memberData.birthDate ? new Date(memberData.birthDate).toLocaleDateString('id-ID') : '-'}
                        </div>
                      )}
                    </div>

                    {/* Jenis Kelamin */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                      {editMode ? (
                        <select
                          value={formData.gender || ''}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        >
                          <option value="">Pilih Jenis Kelamin</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">{memberData.gender || '-'}</div>
                      )}
                    </div>

                    {/* Agama */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Agama</label>
                      {editMode ? (
                        <select
                          value={formData.religionId || ''}
                          onChange={(e) => setFormData({...formData, religionId: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        >
                          <option value="">Pilih Agama</option>
                          {religions.map((religion) => (
                            <option key={religion.id} value={religion.id}>
                              {religion.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">{memberData.religion?.name || '-'}</div>
                      )}
                    </div>

                    {/* Golongan Darah */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Golongan Darah</label>
                      {editMode ? (
                        <select
                          value={formData.bloodType || ''}
                          onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        >
                          <option value="">Pilih Golongan Darah</option>
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="AB">AB</option>
                          <option value="O">O</option>
                          <option value="Tidak Tahu">Tidak Tahu</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">{memberData.bloodType || '-'}</div>
                      )}
                    </div>

                    {/* Alamat KTP */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alamat KTP</label>
                      {editMode ? (
                        <textarea
                          value={formData.address || ''}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{memberData.address || '-'}</div>
                      )}
                    </div>

                    {/* Kode Pos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Kode Pos</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.postalCode || ''}
                          onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{memberData.postalCode || '-'}</div>
                      )}
                    </div>

                    {/* Handphone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Handphone</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={formData.phone || formData.phoneNumber || ''}
                          onChange={(e) => setFormData({...formData, phone: e.target.value, phoneNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{memberData.phone || memberData.phoneNumber || '-'}</div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* DATA PEKERJAAN TAB */
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Left Column - Photo and Basic Info */}
                  <div className="lg:col-span-1">
                    <div className="text-center">
                      {/* Photo */}
                      <div className="relative inline-block mb-6">
                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Preview"
                            className="w-48 h-64 object-cover rounded-lg border-4 border-red-500"
                            onError={(e) => {
                              console.error('❌ PHOTO ERROR: Failed to load photoPreview:', photoPreview);
                              setPhotoPreview(null);
                            }}
                          />
                        ) : displayPhoto ? (
                          <img
                            src={displayPhoto}
                            alt={memberData.name}
                            className="w-48 h-64 object-cover rounded-lg border-4 border-red-500"
                            onError={(e) => {
                              console.error('❌ PHOTO ERROR: Failed to load displayPhoto:', displayPhoto);
                              console.error('❌ PHOTO ERROR: Original memberData.photo:', memberData.photo);
                            }}
                            onLoad={() => {
                              console.log('✅ PHOTO SUCCESS: Successfully loaded displayPhoto:', displayPhoto);
                            }}
                          />
                        ) : (
                          <div className="w-48 h-64 bg-red-500 rounded-lg flex items-center justify-center border-4 border-red-500">
                            <User className="h-24 w-24 text-white" />
                          </div>
                        )}
                        {editMode && (
                          <label className="absolute bottom-2 right-2 bg-pgri-red text-white p-2 rounded-full hover:bg-red-700 cursor-pointer">
                            <Camera className="h-4 w-4" />
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png"
                              onChange={handlePhotoChange}
                              className="sr-only"
                            />
                          </label>
                        )}
                      </div>

                      {/* Name and Title */}
                      <div className="mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {memberData.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          NPA: {memberData.npa || memberData.oldNpa || '-'}
                        </p>
                      </div>

                      {/* Basic Stats */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">NPA</span>
                          <span className="text-gray-900">{memberData.npa || memberData.oldNpa || '-'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">Status</span>
                          <span className="flex items-center text-blue-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Terverifikasi
                          </span>
                        </div>
                      </div>

                      {/* QR Code */}
                      <div className="mb-6">
                        <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                          {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="QR Code" className="w-full h-full rounded-lg" />
                          ) : (
                            <QrCode className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">QR Code Anggota</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Work Information */}
                  <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {/* Nama Institusi */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama Institusi</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.institutionName || ''}
                            onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                          />
                        ) : (
                          <div className="text-sm text-gray-900 font-medium">{memberData.institutionName || '-'}</div>
                        )}
                      </div>

                      {/* Jabatan */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Jabatan</label>
                        {editMode ? (
                          <select
                            value={formData.jobId || ''}
                            onChange={(e) => setFormData({...formData, jobId: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                          >
                            <option value="">Pilih Jabatan</option>
                            {jobs.map((job) => (
                              <option key={job.id} value={job.id}>
                                {job.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{memberData.job?.name || '-'}</div>
                        )}
                      </div>

                      {/* Status Kepegawaian */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status Kepegawaian</label>
                        {editMode ? (
                          <select
                            value={formData.employeeStatusId || ''}
                            onChange={(e) => setFormData({...formData, employeeStatusId: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                          >
                            <option value="">Pilih Status</option>
                            {employeeStatuses.map((status) => (
                              <option key={status.id} value={status.id}>
                                {status.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{memberData.employeeStatus?.name || '-'}</div>
                        )}
                      </div>

                      {/* Pangkat/Golongan */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pangkat/Golongan</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.rank || ''}
                            onChange={(e) => setFormData({...formData, rank: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{memberData.rank || '-'}</div>
                        )}
                      </div>

                      {/* Pendidikan */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pendidikan</label>
                        {editMode ? (
                          <select
                            value={formData.educationId || ''}
                            onChange={(e) => setFormData({...formData, educationId: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                          >
                            <option value="">Pilih Pendidikan</option>
                            {educations.map((education) => (
                              <option key={education.id} value={education.id}>
                                {education.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{memberData.education?.name || '-'}</div>
                        )}
                      </div>

                      {/* Sertifikat Pendidik */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sertifikat Pendidik</label>
                        {editMode ? (
                          <select
                            value={formData.hasEducatorCert ? 'true' : 'false'}
                            onChange={(e) => setFormData({...formData, hasEducatorCert: e.target.value === 'true'})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                          >
                            <option value="false">Tidak Ada</option>
                            <option value="true">Ada</option>
                          </select>
                        ) : (
                          <div className="text-sm text-gray-900">{memberData.hasEducatorCert ? 'Ada' : 'Tidak Ada'}</div>
                        )}
                      </div>

                      {/* Mata Pelajaran */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mata Pelajaran</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={formData.subjects || ''}
                            onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                            placeholder="Contoh: Matematika, Fisika"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{memberData.subjects || '-'}</div>
                        )}
                      </div>

                      {/* Alamat Kerja */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Kerja</label>
                        {editMode ? (
                          <textarea
                            value={formData.workAddress || ''}
                            onChange={(e) => setFormData({...formData, workAddress: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pgri-red"
                          />
                        ) : (
                          <div className="text-sm text-gray-900">{memberData.workAddress || '-'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Debug Script untuk Monitor Foto */}
      <script dangerouslySetInnerHTML={{
        __html: `
          // Debug foto setelah halaman dimuat
          window.addEventListener('load', function() {
            console.log('🔍 DEBUG: Halaman biodata dimuat, memeriksa foto...');
            
            // Cek foto elements
            const photoElements = document.querySelectorAll('img[src*="/uploads/members/"]');
            console.log('📸 Found', photoElements.length, 'photo elements');
            
            photoElements.forEach((img, index) => {
              console.log('Photo', index + 1, ':', {
                src: img.src,
                complete: img.complete,
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight
              });
              
              // Monitor loading
              img.addEventListener('load', function() {
                console.log('✅ Photo loaded successfully:', img.src);
              });
              
              img.addEventListener('error', function() {
                console.error('❌ Photo failed to load:', img.src);
              });
            });
            
            // Cek localStorage
            const memberData = localStorage.getItem('memberData');
            if (memberData) {
              const data = JSON.parse(memberData);
              console.log('💾 Member photo from localStorage:', data.photo);
            }
          });
        `
      }} />
    </MemberLayout>
  );
}