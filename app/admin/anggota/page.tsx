"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
  Search,
  Filter,
  Check,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Edit,
  Calendar,
  Plus,
  Upload,
  QrCode,
  User,
  MapPin,
  Briefcase,
  Trash,
  Trash2,
} from "lucide-react";
import QRCode from "qrcode";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488" />
  </svg>
);

interface Member {
  id: string;
  npa: string;
  name: string;
  fullName?: string;
  email: string;
  password: string;
  plainPassword?: string;
  nik: string;
  phoneNumber: string;
  birthPlace: string;
  birthDate: string;
  gender: string;
  address: string;
  village?: string;
  institutionName: string;
  workAddress: string;
  isApproved: boolean;
  isActive: boolean;
  createdAt: string;
  photo?: string;
  bloodType?: string;
  religion?: { id?: number; name: string };
  province?: { id?: number; name: string };
  regency?: { id?: number; name: string };
  district?: { id?: number; name: string };
  job?: { id?: number; name: string };
  education?: { id?: number; name: string };
  employeeStatus?: { id?: number; name: string };
  // Numeric foreign keys returned by API
  religionId?: number;
  provinceId?: number;
  regencyId?: number;
  districtId?: number;
  villageId?: number;
  jobId?: number;
  educationId?: number;
  employeeStatusId?: number;
  rank?: string;
  subjects?: string;
  hasEducatorCert?: boolean;
  teachingLevels?: Array<{ name: string }>;
}

interface MemberStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface District {
  id: number;
  name: string;
  fullName: string;
}

interface MasterData {
  religions: Array<{ id: number; name: string }>;
  provinces: Array<{ id: number; name: string }>;
  regencies: Array<{ id: number; name: string }>;
  districts: Array<{ id: number; name: string }>;
  villages: Array<{ id: number; name: string }>;
  jobs: Array<{ id: number; name: string }>;
  educations: Array<{ id: number; name: string }>;
  employeeStatuses: Array<{ id: number; name: string }>;
  teachingLevels: Array<{ id: number; name: string }>;
}

export default function AdminAnggotaPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MemberStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchNama, setSearchNama] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [qrCodes, setQrCodes] = useState<{ [key: string]: string }>({});
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [searchDebounceTimer, setSearchDebounceTimer] =
    useState<NodeJS.Timeout | null>(null);

  const [masterData, setMasterData] = useState<MasterData>({
    religions: [],
    provinces: [],
    regencies: [],
    districts: [],
    villages: [],
    jobs: [],
    educations: [],
    employeeStatuses: [],
    teachingLevels: [],
  });
  const [editFormData, setEditFormData] = useState({
    provinceId: 0,
    regencyId: 0,
    districtId: 0,
    villageId: 0,
  });
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [editPhotoPreview, setEditPhotoPreview] = useState<string | null>(null);
  const [photoTimestamps, setPhotoTimestamps] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchDistricts();
    fetchMasterData();
  }, []);

  useEffect(() => {
    fetchMembers();
    fetchStats();
  }, [
    currentPage,
    selectedDistrictId,
    statusFilter,
    entriesPerPage,
    searchTerm,
    searchNama,
  ]);

  // Generate QR code when selectedMember changes
  useEffect(() => {
    if (selectedMember && !qrCodes[selectedMember.id]) {
      generateQRCode(selectedMember);
    }
  }, [selectedMember]);

  // Reset password visibility when selectedMember changes
  useEffect(() => {

  }, [selectedMember]);

  // Populate edit form data when editingMember changes
  useEffect(() => {
    if (editingMember) {
      // Load cascading data for edit form
      const loadCascadingData = async () => {
        try {
          // Load regencies if province exists
          if (editingMember.provinceId) {
            await fetchRegencies(editingMember.provinceId);
          }

          // Load districts if regency exists
          if (editingMember.regencyId) {
            await fetchDistrictsForEdit(editingMember.regencyId);
          }

          // Load villages if district exists
          if (editingMember.districtId) {
            await fetchVillages(editingMember.districtId);
          }
        } catch (error) {
          console.error("Error loading cascading data:", error);
        }
      };

      loadCascadingData();
    }
  }, [editingMember]);

  // Generate QR codes for all members when members list changes
  useEffect(() => {
    members.forEach((member) => {
      if (!qrCodes[member.id]) {
        generateQRCode(member);
      }
    });
  }, [members]);

  // Generate QR Code for member
  const generateQRCode = async (member: Member) => {
    try {
      const memberData = {
        npa: member.npa,
        nik: member.nik,
        name: member.name,
        institution: member.institutionName,
        phone: member.phoneNumber,
      };
      const qrDataString = JSON.stringify(memberData);
      const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
        width: 100,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodes((prev) => ({ ...prev, [member.id]: qrCodeDataURL }));
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Format birth date
  const formatBirthDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Get status badge - Always show 'Aktif'
  const getStatusBadge = (isApproved: boolean, isActive: boolean) => {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Aktif
      </span>
    );
  };

  // Open WhatsApp
  const openWhatsApp = (phoneNumber: string) => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const formattedPhone = cleanPhone.startsWith("0")
      ? "62" + cleanPhone.slice(1)
      : cleanPhone;
    window.open(`https://wa.me/${formattedPhone}`, "_blank");
  };

  // Refresh photo timestamps to force cache-busting
  const refreshPhotoTimestamps = () => {
    const newTimestamps: {[key: string]: number} = {};
    const currentTime = Date.now();
    
    members.forEach((member: Member) => {
      if (member.photo) {
        newTimestamps[member.id] = currentTime;
      }
    });
    
    setPhotoTimestamps(newTimestamps);
    console.log('🔄 ADMIN: Refreshed all photo timestamps:', newTimestamps);
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: entriesPerPage.toString(),
        search: searchTerm,
        searchNama: searchNama,
        status: statusFilter,
      });

      if (selectedDistrictId) {
        params.append("districtId", selectedDistrictId);
      }

      const response = await fetch(`/api/admin/members?${params}`);
      const data = await response.json();

      if (data.success) {
        setMembers(data.members);
        setTotalPages(data.totalPages);
        setTotalEntries(data.totalEntries || 0);
        
        // Initialize/refresh photo timestamps for cache-busting
        const refreshedTimestamps: {[key: string]: number} = {};
        const currentTime = Date.now();
        
        data.members.forEach((member: Member) => {
          if (member.photo) {
            refreshedTimestamps[member.id] = currentTime;
          }
        });
        
        if (Object.keys(refreshedTimestamps).length > 0) {
          setPhotoTimestamps(prev => ({
            ...prev,
            ...refreshedTimestamps
          }));
          console.log('🔄 ADMIN: Auto-refreshed photo timestamps on data fetch:', refreshedTimestamps);
        }
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/members/stats");
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const response = await fetch("/api/admin/districts");
      const data = await response.json();

      if (data.success) {
        setDistricts(data.districts);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };



  const fetchMasterData = async () => {
    try {
      console.log("Fetching master data...");

      const [
        religionsRes,
        provincesRes,
        jobsRes,
        educationsRes,
        employeeStatusesRes,
        teachingLevelsRes,
      ] = await Promise.all([
        fetch("/api/public/religions"),
        fetch("/api/public/provinces"),
        fetch("/api/public/jobs"),
        fetch("/api/public/educations"),
        fetch("/api/public/employee-statuses"),
        fetch("/api/public/teaching-levels"),
      ]);

      // Check if all responses are ok
      if (
        !religionsRes.ok ||
        !provincesRes.ok ||
        !jobsRes.ok ||
        !educationsRes.ok ||
        !employeeStatusesRes.ok ||
        !teachingLevelsRes.ok
      ) {
        throw new Error("One or more API requests failed");
      }

      const [
        religions,
        provinces,
        jobs,
        educations,
        employeeStatuses,
        teachingLevels,
      ] = await Promise.all([
        religionsRes.json(),
        provincesRes.json(),
        jobsRes.json(),
        educationsRes.json(),
        employeeStatusesRes.json(),
        teachingLevelsRes.json(),
      ]);

      console.log("Master data fetched:", {
        religions: religions.religions?.length || 0,
        provinces: provinces.provinces?.length || 0,
        jobs: jobs.jobs?.length || 0,
        educations: educations.educations?.length || 0,
        employeeStatuses: employeeStatuses.employeeStatuses?.length || 0,
        teachingLevels: teachingLevels.teachingLevels?.length || 0,
      });

      setMasterData({
        religions: religions.success ? religions.religions : [],
        provinces: provinces.success ? provinces.provinces : [],
        regencies: [],
        districts: [],
        villages: [],
        jobs: jobs.success ? jobs.jobs : [],
        educations: educations.success ? educations.educations : [],
        employeeStatuses: employeeStatuses.success
          ? employeeStatuses.employeeStatuses
          : [],
        teachingLevels: teachingLevels.success
          ? teachingLevels.teachingLevels
          : [],
      });
    } catch (error) {
      console.error("Error fetching master data:", error);
      alert("Gagal memuat data master. Silakan refresh halaman.");
    }
  };

  const fetchRegencies = async (provinceId: number) => {
    try {
      const response = await fetch(
        `/api/public/regencies?provinceId=${provinceId}`,
      );
      const data = await response.json();
      if (data.success) {
        setMasterData((prev) => ({
          ...prev,
          regencies: data.regencies,
          districts: [],
          villages: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching regencies:", error);
    }
  };

  const fetchDistrictsForEdit = async (regencyId: number) => {
    try {
      const response = await fetch(
        `/api/public/districts?regencyId=${regencyId}`,
      );
      const data = await response.json();
      if (data.success) {
        setMasterData((prev) => ({
          ...prev,
          districts: data.districts,
          villages: [],
        }));
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchVillages = async (districtId: number) => {
    try {
      const response = await fetch(
        `/api/public/villages?districtId=${districtId}`,
      );
      const data = await response.json();
      if (data.success) {
        setMasterData((prev) => ({ ...prev, villages: data.villages }));
      }
    } catch (error) {
      console.error("Error fetching villages:", error);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchValue: string, searchType: "nama" | "general") => {
      if (searchDebounceTimer) {
        clearTimeout(searchDebounceTimer);
      }

      const timer = setTimeout(() => {
        if (searchType === "nama") {
          setSearchNama(searchValue);
        } else {
          setSearchTerm(searchValue);
        }
        setCurrentPage(1); // Reset to first page when searching
      }, 500); // 500ms delay

      setSearchDebounceTimer(timer);
    },
    [searchDebounceTimer],
  );

  // Handle search input changes
  const handleSearchNama = (value: string) => {
    debouncedSearch(value, "nama");
  };

  const handleSearchGeneral = (value: string) => {
    debouncedSearch(value, "general");
  };

  const updateMemberStatus = async (
    memberId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (data.success) {
        fetchMembers();
        fetchStats();
        setShowDetail(false);
        alert(
          `Anggota berhasil ${status === "APPROVED" ? "disetujui" : "ditolak"}`,
        );
      } else {
        alert("Gagal mengupdate status anggota");
      }
    } catch (error) {
      console.error("Error updating member status:", error);
      alert("Terjadi kesalahan saat mengupdate status");
    }
  };

  const deleteMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        fetchMembers();
        fetchStats();
        setShowDeleteModal(false);
        setMemberToDelete(null);
        alert("Anggota berhasil dihapus");
      } else {
        alert(data.message || "Gagal menghapus anggota");
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      alert("Terjadi kesalahan saat menghapus anggota");
    }
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setEditPhotoFile(null);
    setEditPhotoPreview(null);
    setShowEditModal(true);
  };

  const handleEditPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diperbolehkan');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      setEditPhotoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateMember = async (updatedData: any) => {
    if (!editingMember) return;

    try {
      // Prepare FormData for API (to handle file upload)
      const formData = new FormData();
      
      // Add all text fields
      formData.append('name', updatedData.name);
      formData.append('email', updatedData.email);
      formData.append('nik', updatedData.nik);
      formData.append('phone', updatedData.phoneNumber);
      formData.append('birthPlace', updatedData.birthPlace);
      formData.append('birthDate', updatedData.birthDate);
      formData.append('gender', updatedData.gender);
      formData.append('religionId', updatedData.religionId && updatedData.religionId !== "" ? updatedData.religionId : '');
      formData.append('bloodType', updatedData.bloodType || '');
      formData.append('address', updatedData.address);
      formData.append('provinceId', updatedData.provinceId && updatedData.provinceId !== "" ? updatedData.provinceId : '');
      formData.append('regencyId', updatedData.regencyId && updatedData.regencyId !== "" ? updatedData.regencyId : '');
      formData.append('districtId', updatedData.districtId && updatedData.districtId !== "" ? updatedData.districtId : '');
      formData.append('villageId', updatedData.villageId || '');
      formData.append('institutionName', updatedData.institutionName);
      formData.append('workAddress', updatedData.workAddress);
      formData.append('jobId', updatedData.jobId && updatedData.jobId !== "" ? updatedData.jobId : '');
      formData.append('educationId', updatedData.educationId && updatedData.educationId !== "" ? updatedData.educationId : '');
      formData.append('employeeStatusId', updatedData.employeeStatusId && updatedData.employeeStatusId !== "" ? updatedData.employeeStatusId : '');
      formData.append('rank', updatedData.rank || '');
      formData.append('hasEducatorCert', updatedData.hasEducatorCert);
      formData.append('subjects', updatedData.subjects || '');
      formData.append('isApproved', editingMember.isApproved.toString());
      formData.append('isActive', editingMember.isActive.toString());
      
      // Add photo file if selected
      if (editPhotoFile) {
        formData.append('photo', editPhotoFile);
      }

      const response = await fetch(`/api/admin/members/${editingMember.id}`, {
        method: "PUT",
        body: formData, // Remove Content-Type header to let browser set it with boundary
      });

      if (response.ok) {
        const responseData = await response.json();
        const updatedMemberData = responseData.member;
        
        console.log('Update response:', responseData);
        console.log('Updated member photo path:', updatedMemberData.photo);
        console.log('Previous member photo path:', editingMember.photo);
        
        // Update photo timestamp for cache-busting if photo was updated
        if (editPhotoFile && updatedMemberData.photo) {
          const newTimestamp = Date.now();
          console.log('Photo file was uploaded, setting new timestamp:', newTimestamp, 'for member:', editingMember.id);
          
          setPhotoTimestamps(prev => {
            const newTimestamps = {
              ...prev,
              [editingMember.id]: newTimestamp
            };
            console.log('Updated photoTimestamps state:', newTimestamps);
            return newTimestamps;
          });
          
          // Force browser to clear image cache with new timestamp
          const img = new Image();
          img.src = `${updatedMemberData.photo}?t=${newTimestamp}&id=${editingMember.id}`;
          console.log('Preloading new image with cache-busting URL:', img.src);
        } else {
          console.log('No photo file uploaded or no photo path returned from API');
        }
        
        console.log('Updating members state with new data for member ID:', editingMember.id);
        console.log('New member data to be set:', updatedMemberData);
        
        setMembers(
          members.map((member) => {
            if (member.id === editingMember.id) {
              const updatedMember = { ...member, ...updatedMemberData };
              console.log('Updated member object:', updatedMember);
              return updatedMember;
            }
            return member;
          }),
        );
        setShowEditModal(false);
        setEditingMember(null);
        setEditPhotoFile(null);
        setEditPhotoPreview(null);
        
        alert("Data anggota berhasil diperbarui");
      } else {
        const error = await response.json();
        alert(error.message || "Gagal memperbarui data anggota");
      }
    } catch (error) {
      console.error("Error updating member:", error);
      alert("Terjadi kesalahan saat memperbarui data");
    }
  };

  const exportMembers = async () => {
    try {
      const response = await fetch("/api/admin/members/export");
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `data-anggota-pgri-oku-timur-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting members:", error);
      alert("Gagal mengekspor data anggota");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Anggota</h1>
            <p className="text-gray-600">Kelola data dan status keanggotaan</p>
          </div>
          <button
            onClick={exportMembers}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Anggota
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Anggota Aktif
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.approved}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex flex-col gap-4">
            {/* Search Fields Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari berdasarkan Nama
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Masukkan nama anggota..."
                    onChange={(e) => handleSearchNama(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cari berdasarkan Kecamatan
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <select
                    value={selectedDistrictId}
                    onChange={(e) => {
                      setSelectedDistrictId(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Semua Kecamatan</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.fullName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Entries per page and general search */}
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="w-full sm:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tampilkan per halaman
                </label>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing entries per page
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10 entries</option>
                  <option value={25}>25 entries</option>
                  <option value={50}>50 entries</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pencarian Umum
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari email, NIK, NPA, atau institusi..."
                    onChange={(e) => handleSearchGeneral(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members Table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Manajemen Anggota
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Kelola data anggota organisasi
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={refreshPhotoTimestamps}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  title="Refresh foto anggota"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Foto
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    No
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Aksi
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    NPA
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    NIK
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Nama
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Tmp Lhr
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Tgl Lhr
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Foto
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Kode QR
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Status Kepegawaian
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Status
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    WhatsApp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Memuat data...
                    </td>
                  </tr>
                ) : members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Tidak ada data anggota
                    </td>
                  </tr>
                ) : (
                  members.map((member, index) => (
                    <tr
                      key={member.id}
                      className="hover:bg-blue-50 transition-colors duration-150"
                    >
                      {/* No */}
                      <td className="px-3 py-3 text-center text-sm text-gray-900 border-r border-gray-200">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>

                      {/* Aksi */}
                      <td className="px-3 py-3 text-center border-r border-gray-200">
                        <div className="flex justify-center space-x-1">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setShowDetail(true);
                            }}
                            className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
                            title="Lihat Detail"
                          >
                            <User className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditMember(member)}
                            className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-100 rounded transition-colors"
                            title="Edit Anggota"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setMemberToDelete(member);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded transition-colors"
                            title="Hapus Anggota"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      {/* NPA */}
                      <td className="px-3 py-3 text-center text-sm text-gray-900 border-r border-gray-200">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                          {member.npa || "Belum ada"}
                        </span>
                      </td>

                      {/* NIK */}
                      <td className="px-3 py-3 text-center text-sm text-gray-900 border-r border-gray-200">
                        <span className="font-mono text-xs">{member.nik}</span>
                      </td>

                      {/* Nama */}
                      <td className="px-3 py-3 text-center text-sm text-gray-900 border-r border-gray-200">
                        <div className="font-medium">{member.name}</div>
                      </td>

                      {/* Tmp Lhr */}
                      <td className="px-3 py-3 text-center text-sm text-gray-900 border-r border-gray-200">
                        {member.birthPlace}
                      </td>

                      {/* Tgl Lhr */}
                      <td className="px-3 py-3 text-center text-sm text-gray-900 border-r border-gray-200">
                        {formatBirthDate(member.birthDate)}
                      </td>

                      {/* Foto */}
                      <td className="px-3 py-3 text-center border-r border-gray-200">
                        <div className="flex justify-center">
                          {member.photo ? (
                            <img
                              src={`${member.photo}?t=${photoTimestamps[member.id] || Date.now()}&id=${member.id}`}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Kode QR */}
                      <td className="px-3 py-3 text-center border-r border-gray-200">
                        <div className="flex justify-center">
                          {qrCodes[member.id] ? (
                            <img
                              src={qrCodes[member.id]}
                              alt="QR Code"
                              className="w-10 h-10"
                            />
                          ) : (
                            <button
                              onClick={() => generateQRCode(member)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                              title="Generate QR Code"
                            >
                              <QrCode className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Status Kepegawaian */}
                      <td className="px-3 py-3 text-center text-sm text-gray-900 border-r border-gray-200">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          {member.employeeStatus?.name || "Belum ada"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3 text-center border-r border-gray-200">
                        {getStatusBadge(member.isApproved, member.isActive)}
                      </td>

                      {/* WhatsApp */}
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => openWhatsApp(member.phoneNumber)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded transition-colors"
                          title="Hubungi via WhatsApp"
                        >
                          <WhatsAppIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {Math.min(
                        (currentPage - 1) * entriesPerPage + 1,
                        totalEntries,
                      )}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * entriesPerPage, totalEntries)}
                    </span>{" "}
                    of <span className="font-medium">{totalEntries}</span>{" "}
                    entries
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Member Detail Modal */}
      {showDetail && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Detail Data Anggota
                </h3>
                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Photo and QR Code */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Photo */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Foto Anggota
                    </h4>
                    <div className="flex justify-center">
                      {selectedMember.photo ? (
                        <img
                          src={`${selectedMember.photo}?t=${photoTimestamps[selectedMember.id] || Date.now()}&id=${selectedMember.id}`}
                          alt={selectedMember.name}
                          className="w-32 h-40 object-cover rounded-lg border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-32 h-40 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      {selectedMember.name}
                    </p>
                    <p className="text-center text-xs text-gray-500">
                      NPA: {selectedMember.npa || "Belum ada"}
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      QR Code
                    </h4>
                    <div className="flex justify-center">
                      {qrCodes[selectedMember.id] ? (
                        <img
                          src={qrCodes[selectedMember.id]}
                          alt="QR Code"
                          className="w-32 h-32 border rounded-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                          <QrCode className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => openWhatsApp(selectedMember.phoneNumber)}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      WhatsApp
                    </button>
                  </div>
                </div>

                {/* Right Column - Member Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Information */}
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b pb-2">
                      Data Pribadi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Email
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 px-3 py-2 rounded border">
                          {selectedMember.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          NIK
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.nik}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          NPA
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.npa || "Belum ada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Nama
                        </label>
                        <p className="mt-1 text-sm text-gray-900 font-semibold">
                          {selectedMember.name}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Jenis Kelamin
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.gender}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Golongan Darah
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.bloodType || "Belum ada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Agama
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.religion?.name || "Belum ada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Tempat Lahir
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.birthPlace}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Tanggal Lahir
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {formatBirthDate(selectedMember.birthDate)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Status Kepegawaian
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.employeeStatus?.name || "Belum ada"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b pb-2">
                      Kontak & Alamat
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Nomor Telepon
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Alamat
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.address}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Kecamatan
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.district?.name || "Belum ada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Kabupaten
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.regency?.name || "Belum ada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Provinsi
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.province?.name || "Belum ada"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b pb-2">
                      Informasi Profesi
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Pekerjaan
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.job?.name || "Belum ada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Pendidikan
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.education?.name || "Belum ada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Nama Institusi
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.institutionName}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Alamat Kerja
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.workAddress}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Pangkat/Golongan
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.rank || "Belum ada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Mata Pelajaran
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.subjects || "Belum ada"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Sertifikat Pendidik
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.hasEducatorCert ? "Ya" : "Tidak"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Jenjang Mengajar
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {selectedMember.teachingLevels
                            ?.map((level) => level.name)
                            .join(", ") || "Belum ada"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* System Information */}
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-4 text-lg border-b pb-2">
                      Informasi Sistem
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Status
                        </label>
                        <div className="mt-1">
                          {getStatusBadge(
                            selectedMember.isApproved,
                            selectedMember.isActive,
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">
                          Password
                        </label>
                        <div className="mt-1">
                          <div className="text-sm text-gray-900 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                            <span className="font-mono text-blue-800">
                              {selectedMember.plainPassword || "Password tidak tersedia (anggota lama)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-20 rounded-lg p-2">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Edit Data Anggota
                    </h3>
                    <p className="text-blue-100 text-sm">
                      {editingMember.fullName}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMember(null);
                  }}
                  className="text-white hover:text-blue-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const updatedData = {
                    name: formData.get("name") as string,
                    email: formData.get("email") as string,
                    nik: formData.get("nik") as string,
                    phoneNumber: formData.get("phoneNumber") as string,
                    birthPlace: formData.get("birthPlace") as string,
                    birthDate: formData.get("birthDate") as string,
                    gender: formData.get("gender") as string,
                    religionId: parseInt(formData.get("religionId") as string),
                    bloodType: formData.get("bloodType") as string,
                    address: formData.get("address") as string,
                    postalCode: formData.get("postalCode") as string,
                    provinceId: parseInt(formData.get("provinceId") as string),
                    regencyId: parseInt(formData.get("regencyId") as string),
                    districtId: parseInt(formData.get("districtId") as string),
                    village: formData.get("village") as string,
                    institutionName: formData.get("institutionName") as string,
                    workAddress: formData.get("workAddress") as string,
                    jobId: parseInt(formData.get("jobId") as string),
                    educationId: parseInt(
                      formData.get("educationId") as string,
                    ),
                    employeeStatusId: parseInt(
                      formData.get("employeeStatusId") as string,
                    ),
                    rank: formData.get("rank") as string,
                    hasEducatorCert: formData.get("hasEducatorCert") === "true",
                    subjects: formData.get("subjects") as string,
                  };
                  updateMember(updatedData);
                }}
              >
                <div className="space-y-6">
                  {/* Data Pribadi */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center border-b border-gray-300 pb-3">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      Data Pribadi
                    </h4>
                    
                    {/* Foto Section */}
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Foto Anggota
                      </label>
                      <div className="flex items-start space-x-4">
                        {/* Current Photo */}
                        <div className="flex-shrink-0">
                          {editPhotoPreview ? (
                            <img
                              src={editPhotoPreview}
                              alt="Preview"
                              className="w-24 h-32 object-cover rounded-lg border-2 border-gray-300"
                            />
                          ) : editingMember.photo ? (
                            <img
                              src={`${editingMember.photo}?t=${photoTimestamps[editingMember.id] || Date.now()}&id=${editingMember.id}`}
                              alt={editingMember.name}
                              className="w-24 h-32 object-cover rounded-lg border-2 border-gray-300"
                            />
                          ) : (
                            <div className="w-24 h-32 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                              <User className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        {/* Upload Controls */}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg,image/png"
                            onChange={handleEditPhotoChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Format: JPG, JPEG, PNG. Maksimal 5MB.
                          </p>
                          {editPhotoFile && (
                            <button
                              type="button"
                              onClick={() => {
                                setEditPhotoFile(null);
                                setEditPhotoPreview(null);
                              }}
                              className="mt-2 text-sm text-red-600 hover:text-red-800"
                            >
                              Hapus foto baru
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          name="name"
                          defaultValue={editingMember.name}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={editingMember.email}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NIK
                        </label>
                        <input
                          type="text"
                          name="nik"
                          defaultValue={editingMember.nik}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor Telepon
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          defaultValue={editingMember.phoneNumber}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tempat Lahir
                        </label>
                        <input
                          type="text"
                          name="birthPlace"
                          defaultValue={editingMember.birthPlace}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tanggal Lahir
                        </label>
                        <input
                          type="date"
                          name="birthDate"
                          defaultValue={
                            editingMember.birthDate
                              ? new Date(editingMember.birthDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Jenis Kelamin
                        </label>
                        <select
                          name="gender"
                          defaultValue={editingMember.gender}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih jenis kelamin</option>
                          <option value="MALE">Laki-laki</option>
                          <option value="FEMALE">Perempuan</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agama
                        </label>
                        <select
                          name="religionId"
                          defaultValue={editingMember.religion?.id || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih agama</option>
                          {masterData.religions.length > 0 ? (
                            masterData.religions.map((religion) => (
                              <option key={religion.id} value={religion.id}>
                                {religion.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Loading...
                            </option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Golongan Darah
                        </label>
                        <select
                          name="bloodType"
                          defaultValue={editingMember.bloodType || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  </div>

                  {/* Alamat */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center border-b border-gray-300 pb-3">
                      <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                      Alamat
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alamat Lengkap
                        </label>
                        <textarea
                          name="address"
                          defaultValue={editingMember.address}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kode Pos
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          defaultValue=""
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={5}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Provinsi
                        </label>
                        <select
                          name="provinceId"
                          defaultValue={editingMember.provinceId || ""}
                          onChange={(e) => {
                            const provinceId = parseInt(e.target.value);
                            if (provinceId) {
                              fetchRegencies(provinceId);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih provinsi</option>
                          {masterData.provinces.length > 0 ? (
                            masterData.provinces.map((province) => (
                              <option key={province.id} value={province.id}>
                                {province.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Loading...
                            </option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kabupaten
                        </label>
                        <select
                          name="regencyId"
                          defaultValue={editingMember.regencyId || ""}
                          onChange={(e) => {
                            const regencyId = parseInt(e.target.value);
                            if (regencyId) {
                              fetchDistrictsForEdit(regencyId);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih kabupaten</option>
                          {masterData.regencies.length > 0 ? (
                            masterData.regencies.map((regency) => (
                              <option key={regency.id} value={regency.id}>
                                {regency.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Pilih provinsi terlebih dahulu
                            </option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kecamatan
                        </label>
                        <select
                          name="districtId"
                          defaultValue={editingMember.districtId || ""}
                          onChange={(e) => {
                            const districtId = parseInt(e.target.value);
                            if (districtId) {
                              fetchVillages(districtId);
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih kecamatan</option>
                          {masterData.districts.length > 0 ? (
                            masterData.districts.map((district) => (
                              <option key={district.id} value={district.id}>
                                {district.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Pilih kabupaten terlebih dahulu
                            </option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Desa/Kelurahan
                        </label>
                        <input
                          type="text"
                          name="village"
                          defaultValue={editingMember.village}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Data Pekerjaan */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center border-b border-gray-300 pb-3">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                      Data Pekerjaan
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nama Institusi
                        </label>
                        <input
                          type="text"
                          name="institutionName"
                          defaultValue={editingMember.institutionName}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="md:col-span-2 lg:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Alamat Tempat Kerja
                        </label>
                        <textarea
                          name="workAddress"
                          defaultValue={editingMember.workAddress}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pekerjaan
                        </label>
                        <select
                          name="jobId"
                          defaultValue={editingMember.job?.id || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih pekerjaan</option>
                          {masterData.jobs.length > 0 ? (
                            masterData.jobs.map((job) => (
                              <option key={job.id} value={job.id}>
                                {job.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Loading...
                            </option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pendidikan Terakhir
                        </label>
                        <select
                          name="educationId"
                          defaultValue={editingMember.education?.id || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih pendidikan</option>
                          {masterData.educations.length > 0 ? (
                            masterData.educations.map((education) => (
                              <option key={education.id} value={education.id}>
                                {education.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Loading...
                            </option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status Pegawai
                        </label>
                        <select
                          name="employeeStatusId"
                          defaultValue={editingMember.employeeStatus?.id || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih status pegawai</option>
                          {masterData.employeeStatuses.length > 0 ? (
                            masterData.employeeStatuses.map((status) => (
                              <option key={status.id} value={status.id}>
                                {status.name}
                              </option>
                            ))
                          ) : (
                            <option value="" disabled>
                              Loading...
                            </option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pangkat/Golongan
                        </label>
                        <input
                          type="text"
                          name="rank"
                          defaultValue={editingMember.rank || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Jika tidak ada, isi dengan tanda -"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sertifikat Pendidik
                        </label>
                        <select
                          name="hasEducatorCert"
                          defaultValue={
                            editingMember.hasEducatorCert ? "true" : "false"
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="false">Belum ada</option>
                          <option value="true">Sudah ada</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mata Pelajaran
                        </label>
                        <input
                          type="text"
                          name="subjects"
                          defaultValue={editingMember.subjects || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Mata pelajaran yang diampu"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="bg-gray-100 -mx-6 -mb-6 px-6 py-4 mt-8 border-t border-gray-200">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingMember(null);
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && memberToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Konfirmasi Hapus
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin menghapus anggota{" "}
              <strong>{memberToDelete.name}</strong>? Tindakan ini tidak dapat
              dibatalkan.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setMemberToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => deleteMember(memberToDelete.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
