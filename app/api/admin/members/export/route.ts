import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Token tidak ditemukan' }, { status: 401 })
    }

    const user = await getCurrentUser(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
    }

    // Fetch all members with complete data
    const members = await prisma.member.findMany({
      include: {
        religion: true,
        province: true,
        regency: true,
        district: true,
        job: true,
        education: true,
        employeeStatus: true,
        teachingLevels: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Prepare data for Excel
    const excelData = members.map((member, index) => ({
      'No': index + 1,
      'NPA': member.npa || '',
      'NIK': member.nik || '',
      'Nama Lengkap': member.name || '',
      'Email': member.email || '',
      'No. Telepon': member.phoneNumber || '',
      'Tempat Lahir': member.birthPlace || '',
      'Tanggal Lahir': member.birthDate ? new Date(member.birthDate).toLocaleDateString('id-ID') : '',
      'Jenis Kelamin': member.gender === 'male' ? 'Laki-laki' : member.gender === 'female' ? 'Perempuan' : '',
      'Golongan Darah': member.bloodType || '',
      'Agama': member.religion?.name || '',
      'Alamat': member.address || '',
      'Provinsi': member.province?.name || '',
      'Kabupaten/Kota': member.regency?.name || '',
      'Kecamatan': member.district?.name || '',
      'Desa/Kelurahan': member.village || '',
      'Pekerjaan': member.job?.name || '',
      'Pendidikan': member.education?.name || '',
      'Status Kepegawaian': member.employeeStatus?.name || '',
      'Pangkat/Golongan': member.rank || '',
      'Nama Institusi': member.institutionName || '',
      'Alamat Kerja': member.workAddress || '',
      'Mata Pelajaran': member.subjects || '',
      'Sertifikat Pendidik': member.hasEducatorCert ? 'Ya' : 'Tidak',
      'Jenjang Mengajar': member.teachingLevels?.map(tl => tl.name).join(', ') || '',
      'Status Keanggotaan': member.isApproved ? 'Disetujui' : 'Menunggu',
      'Status Aktif': member.isActive ? 'Aktif' : 'Tidak Aktif',
      'Tanggal Daftar': new Date(member.createdAt).toLocaleDateString('id-ID'),
    }))

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Set column widths
    const columnWidths = [
      { wch: 5 },   // No
      { wch: 15 },  // NPA
      { wch: 20 },  // NIK
      { wch: 25 },  // Nama Lengkap
      { wch: 30 },  // Email
      { wch: 15 },  // No. Telepon
      { wch: 20 },  // Tempat Lahir
      { wch: 15 },  // Tanggal Lahir
      { wch: 15 },  // Jenis Kelamin
      { wch: 10 },  // Golongan Darah
      { wch: 15 },  // Agama
      { wch: 40 },  // Alamat
      { wch: 20 },  // Provinsi
      { wch: 20 },  // Kabupaten/Kota
      { wch: 20 },  // Kecamatan
      { wch: 20 },  // Desa/Kelurahan
      { wch: 20 },  // Pekerjaan
      { wch: 20 },  // Pendidikan
      { wch: 20 },  // Status Kepegawaian
      { wch: 15 },  // Pangkat/Golongan
      { wch: 30 },  // Nama Institusi
      { wch: 40 },  // Alamat Kerja
      { wch: 25 },  // Mata Pelajaran
      { wch: 15 },  // Sertifikat Pendidik
      { wch: 20 },  // Jenjang Mengajar
      { wch: 15 },  // Status Keanggotaan
      { wch: 15 },  // Status Aktif
      { wch: 15 },  // Tanggal Daftar
    ]
    worksheet['!cols'] = columnWidths

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Anggota')

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { 
      type: 'buffer', 
      bookType: 'xlsx' 
    })

    // Create filename with current date
    const currentDate = new Date().toISOString().split('T')[0]
    const filename = `data-anggota-pgri-oku-timur-${currentDate}.xlsx`

    // Return Excel file
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString(),
      },
    })

  } catch (error) {
    console.error('Error exporting members:', error)
    return NextResponse.json(
      { error: 'Gagal mengekspor data anggota' },
      { status: 500 }
    )
  }
}