import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const user = await getCurrentUser(token)

    if (!user || user.role !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const member = await prisma.member.findUnique({
      where: { id: user.id },
      include: {
        religion: true,
        province: true,
        regency: true,
        district: true,
        job: true,
        education: true,
        employeeStatus: true,
        teachingLevels: true
      }
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Determine base URL for direct image fallback
    const host = request.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const origin = `${protocol}://${host}`

    // Read logo file
    const logoPath = path.join(process.cwd(), 'public', 'images', 'Logo-pgri-png.svg')
    const logoSvg = fs.readFileSync(logoPath, 'utf8')
    const logoBase64 = Buffer.from(logoSvg).toString('base64')

    // Read signature image (Ketua & Sekretaris)
    const signaturePath = path.join(process.cwd(), 'public', 'images', 'ttd-biodata.jpg')
    const signatureBase64 = fs.existsSync(signaturePath)
      ? fs.readFileSync(signaturePath).toString('base64')
      : ''

    // Read member photo if available
    let photoBase64 = ''
    let photoMime = 'image/jpeg'
    if (member.photo) {
      const memberPhotoPath = path.join(process.cwd(), 'public', member.photo.replace(/^\//, ''))
      if (fs.existsSync(memberPhotoPath)) {
        const ext = path.extname(memberPhotoPath).toLowerCase()
        switch (ext) {
          case '.jpg':
          case '.jpeg':
            photoMime = 'image/jpeg';
            break;
          case '.png':
            photoMime = 'image/png';
            break;
          case '.gif':
            photoMime = 'image/gif';
            break;
          case '.webp':
            photoMime = 'image/webp';
            break;
          case '.svg':
            photoMime = 'image/svg+xml';
            break;
          default:
            photoMime = 'image/*';
        }
        if (ext === '.svg') {
          const svgContent = fs.readFileSync(memberPhotoPath, 'utf8')
          photoBase64 = Buffer.from(svgContent).toString('base64')
        } else {
          const buf = fs.readFileSync(memberPhotoPath)
          photoBase64 = buf.toString('base64')
        }
      }
    }

    // Format tanggal (robust terhadap Date | string | null/undefined)
    const formatDate = (dateInput: unknown): string => {
      if (!dateInput) return '-'
      let date: Date
      if (dateInput instanceof Date) {
        date = dateInput
      } else if (typeof dateInput === 'string') {
        const parsed = new Date(dateInput)
        if (isNaN(parsed.getTime())) return '-'
        date = parsed
      } else {
        return '-'
      }
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }

    // Get current date for print date
    const currentDate = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long', 
      year: 'numeric'
    })

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Biodata Anggota - ${member.name}</title>
      <style>
        @page {
          size: A4;
          margin: 8mm 18mm 10mm 18mm;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Times New Roman', serif;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
        }
        
        .header {
          text-align: center;
          margin-bottom: 12px;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }
        
        .header-logo {
          display: inline-block;
          width: 90px;
          height: 90px;
          margin-bottom: 8px;
        }
        
        .header h1 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 2px;
          letter-spacing: 0.5px;
        }
        
        .header h2 {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 2px;
          letter-spacing: 0.3px;
        }
        
        .header p {
          font-size: 11px;
          margin-bottom: 1px;
        }
        
        .title {
          text-align: center;
          margin: 10px 0 8px 0;
        }
        
        .title h3 {
          font-size: 14px;
          font-weight: bold;
          text-decoration: underline;
          letter-spacing: 1px;
        }
        
        .content {
          margin-bottom: 14px;
        }

        /* Layout baris: Foto kiri + konten kanan */
        .layout-row {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          margin-top: 6px;
        }
        .photo-left {
          width: 120px;
          padding: 8px;
          border: 1.5px solid #2e7d32;
          border-radius: 10px;
          background: #f8fff8;
          text-align: center;
          min-height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #555;
          font-size: 11px;
        }
        .photo-left img {
          width: 100%;
          height: 160px; /* rasio 3x4 mendekati */
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #2e7d32;
        }

        /* Photo card integrated in right column */
        .profile-card {
          text-align: center;
          margin-bottom: 6px;
        }
        .profile-card img {
          width: 100%;
          max-width: 140px;
          height: auto;
          object-fit: cover;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 3px;
          background: #fafafa;
        }

        /* Foto 3x4 di kanan bawah (kotak merah) */
        .photo-right {
          display: flex;
          justify-content: flex-start; /* geser ke kiri sejajar dengan tabel */
          margin-top: 8px;
        }
        .photo-right-box {
          width: 113px; /* ~3cm */
          height: 151px; /* ~4cm */
          border: 2px solid #e53935; /* merah */
          border-radius: 4px;
          display: flex;
          align-items: flex-end; /* konten nempel bawah */
          justify-content: flex-end; /* konten nempel kanan */
          overflow: hidden;
          background: #fff;
        }
        .photo-right-box img {
          width: 113px;
          height: 151px;
          object-fit: cover; /* jaga rasio 3x4 mengisi kotak */
        }
        .photo-right-box span {
          font-size: 10px;
          color: #888;
          padding: 4px;
        }
        
        .sections-container {
          display: flex;
          gap: 16px;
        }
        
        .section {
          flex: 1;
          margin-bottom: 15px;
        }
        
        .section-title {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 6px;
          text-decoration: underline;
          text-align: center;
          background-color: #f7f7f7;
          padding: 4px 8px;
          border: 1px solid #ccc;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        
        .data-table td {
          padding: 3px 5px;
          vertical-align: top;
          border: none;
          font-size: 10.5px;
        }
        
        .data-table .label {
          width: 35%;
          font-weight: bold;
        }
        
        .data-table .colon {
          width: 5%;
          text-align: center;
        }
        
        .data-table .value {
          width: 60%;
          font-weight: normal;
          white-space: normal;
          word-wrap: break-word;
          overflow-wrap: anywhere;
        }
        
        .footer {
          margin-top: 16px;
          text-align: center;
        }
        
        
        
        .footer-signature {
          text-align: center;
        }

        .signature-image {
          margin-top: 8px;
          width: 300px;
          height: auto;
          display: inline-block;
        }
        
        .footer-print {
          font-size: 10px;
          color: #666;
          margin-top: 8px;
          border-top: 1px solid #bbb;
          padding-top: 6px;
        }
      </style>
    </head>
    <body>
      <!-- Header dengan Kop Surat -->
      <div class="header">
        <img src="data:image/svg+xml;base64,${logoBase64}" class="header-logo" alt="Logo PGRI">
        <h1>PENGURUS PERSATUAN GURU REPUBLIK INDONESIA</h1>
        <h2>KABUPATEN OGAN KOMERING ULU TIMUR</h2>
        <p>Sekretariat: Jalan Pertanian Km. 3,5 Desa Kromongan Kecamatan Martapura</p>
        <p>Kode Pos 32181</p>
      </div>
      
      <!-- Judul -->
      <div class="title">
        <h3>BIODATA ANGGOTA</h3>
      </div>

      
      
      <!-- Konten -->
      <div class="content">
        <div class="layout-row">
          <div class="sections-container">
          <!-- Data Pribadi -->
          <div class="section">
            <div class="section-title">DATA PRIBADI</div>
            <table class="data-table">
              <tr>
                <td class="label">Nama Lengkap</td>
                <td class="colon">:</td>
                <td class="value">${member.name || '-'}</td>
              </tr>
              <tr>
                <td class="label">NPA PGRI</td>
                <td class="colon">:</td>
                <td class="value">${member.npa || member.oldNpa || '-'}</td>
              </tr>
              <tr>
                <td class="label">NIK</td>
                <td class="colon">:</td>
                <td class="value">${member.nik || '-'}</td>
              </tr>
              <tr>
                <td class="label">Email</td>
                <td class="colon">:</td>
                <td class="value">${member.email || '-'}</td>
              </tr>
              <tr>
                <td class="label">Tempat, Tanggal Lahir</td>
                <td class="colon">:</td>
                <td class="value">${member.birthPlace || '-'}, ${formatDate(member.birthDate)}</td>
              </tr>
              <tr>
                <td class="label">Jenis Kelamin</td>
                <td class="colon">:</td>
                <td class="value">${member.gender || '-'}</td>
              </tr>
              <tr>
                <td class="label">Agama</td>
                <td class="colon">:</td>
                <td class="value">${member.religion?.name || '-'}</td>
              </tr>
              <tr>
                <td class="label">Golongan Darah</td>
                <td class="colon">:</td>
                <td class="value">${member.bloodType || '-'}</td>
              </tr>
              <tr>
                <td class="label">No. Telepon</td>
                <td class="colon">:</td>
                <td class="value">${member.phoneNumber || '-'}</td>
              </tr>
              <tr>
                <td class="label">Alamat</td>
                <td class="colon">:</td>
                <td class="value">${member.address || '-'}</td>
              </tr>
              <tr>
                <td class="label">Desa/Kelurahan</td>
                <td class="colon">:</td>
                <td class="value">${member.village || '-'}</td>
              </tr>
              <tr>
                <td class="label">Kecamatan</td>
                <td class="colon">:</td>
                <td class="value">${member.district?.name || '-'}</td>
              </tr>
              <tr>
                <td class="label">Kabupaten/Kota</td>
                <td class="colon">:</td>
                <td class="value">${member.regency?.name || '-'}</td>
              </tr>
              <tr>
                <td class="label">Provinsi</td>
                <td class="colon">:</td>
                <td class="value">${member.province?.name || '-'}</td>
              </tr>
              <tr>
                <td class="label">Kode Pos</td>
                <td class="colon">:</td>
                <td class="value">${member.postalCode || '-'}</td>
              </tr>
            </table>
          </div>
          
          <!-- Data Pekerjaan -->
          <div class="section">
            <div class="section-title">DATA PEKERJAAN</div>
            <table class="data-table">
              <tr>
                <td class="label">Nama Institusi</td>
                <td class="colon">:</td>
                <td class="value">${member.institutionName || '-'}</td>
              </tr>
              <tr>
                <td class="label">Jabatan</td>
                <td class="colon">:</td>
                <td class="value">${member.job?.name || '-'}</td>
              </tr>
              <tr>
                <td class="label">Pangkat/Golongan</td>
                <td class="colon">:</td>
                <td class="value">${member.rank || '-'}</td>
              </tr>
              <tr>
                <td class="label">Status Kepegawaian</td>
                <td class="colon">:</td>
                <td class="value">${member.employeeStatus?.name || '-'}</td>
              </tr>
              <tr>
                <td class="label">Alamat Kerja</td>
                <td class="colon">:</td>
                <td class="value">${member.workAddress || '-'}</td>
              </tr>
              <tr>
                <td class="label">Pendidikan Terakhir</td>
                <td class="colon">:</td>
                <td class="value">${member.education?.name || '-'}</td>
              </tr>
              <tr>
                <td class="label">Sertifikat Pendidik</td>
                <td class="colon">:</td>
                <td class="value">${member.hasEducatorCert ? 'Ya' : 'Tidak'}</td>
              </tr>
              <tr>
                <td class="label">Mata Pelajaran</td>
                <td class="colon">:</td>
                <td class="value">${member.subjects || '-'}</td>
              </tr>
              <tr>
                <td class="label">Jenjang Mengajar</td>
                <td class="colon">:</td>
                <td class="value">${member.teachingLevels?.map(tl => tl.name).join(', ') || '-'}</td>
              </tr>
            </table>
            <!-- Kotak merah foto di kanan bawah ukuran 3x4 -->
            <div class="photo-right">
              <div class="photo-right-box">
                ${photoBase64 
                  ? `<img src="data:${photoMime};base64,${photoBase64}" alt="Foto Anggota" />`
                  : `${member.photo ? `<img src="${origin}${member.photo.startsWith('/') ? member.photo : '/' + member.photo}" alt="Foto Anggota" />` : `<span>Foto 3x4</span>`}`}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="footer">
        <div class="footer-signature">
          <div style="margin-bottom: 6px;">OKU Timur, ${currentDate}</div>
          <div style="margin: 4px 0;">Pengurus PGRI Kabupaten OKU Timur</div>
          ${signatureBase64 ? `<img src="data:image/jpeg;base64,${signatureBase64}" alt="Tanda Tangan Ketua dan Sekretaris" class="signature-image" />` : ''}
        </div>
        <div class="footer-print">
          Dicetak pada: ${currentDate}<br>
          Sistem Informasi Anggota PGRI OKU Timur
        </div>
      </div>
    </body>
    </html>
    `

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    })

    await browser.close()

    const pdfArrayBuffer = new ArrayBuffer(pdf.byteLength)
    const pdfView = new Uint8Array(pdfArrayBuffer)
    pdfView.set(pdf)

    return new NextResponse(pdfArrayBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Biodata_${member.name?.replace(/\s+/g, '_')}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating biodata PDF:', error)
    return NextResponse.json(
      { error: 'Gagal membuat PDF biodata' },
      { status: 500 }
    )
  }
}