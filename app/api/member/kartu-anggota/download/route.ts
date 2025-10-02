import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { memberId } = body

    const member = await prisma.member.findUnique({
      where: { id: memberId || user.id },
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

    // Generate HTML for the card with proper styling
    const cardHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: white;
          padding: 10px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          margin: 0;
        }
        
        .card-container {
          width: 280px;
          height: 180px;
          background: white;
          border: 2px solid #fca5a5;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 10px;
        }
        
        .card-header {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          padding: 6px;
          text-align: center;
          position: relative;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 4px;
        }
        
        .logo {
          width: 30px;
          height: 30px;
          background: white;
          border-radius: 50%;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .header-text {
          text-align: center;
          flex: 1;
        }
        
        .header-text h4 {
          font-size: 10px;
          font-weight: bold;
          line-height: 1.1;
          margin: 0;
          letter-spacing: 0.3px;
        }
        
        .header-text p {
          font-size: 9px;
          font-weight: 600;
          margin: 0;
          letter-spacing: 0.2px;
        }
        
        .kartu-anggota {
          font-size: 12px;
          font-weight: bold;
          background: white;
          color: #dc2626;
          padding: 3px 10px;
          border-radius: 10px;
          display: inline-block;
          margin-top: 2px;
          letter-spacing: 0.6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        
        .card-body {
          padding: 6px;
          display: flex;
          gap: 6px;
          background: linear-gradient(135deg, #fafafa, #f5f5f5);
          flex: 1;
        }
        
        .photo-section {
          width: 50px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        
        .photo {
          width: 50px;
          height: 65px;
          background: #f3f4f6;
          border: 2px solid #fca5a5;
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          color: #6b7280;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .info-section {
          flex: 1;
          padding: 2px 0;
        }
        
        .member-name {
          font-size: 10px;
          font-weight: 700;
          margin-bottom: 1px;
          color: #000000;
          line-height: 1.2;
          letter-spacing: 0.025em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
        
        .member-detail {
          font-size: 7px;
          margin-bottom: 1px;
          color: #000000;
          line-height: 1.1;
          display: flex;
          align-items: flex-start;
        }
        
        .member-detail .label {
          font-weight: 600;
          color: #dc2626;
          min-width: 50px;
          flex-shrink: 0;
        }
        
        .member-detail .colon {
          margin: 0 4px;
          font-weight: 600;
          color: #dc2626;
        }
        
        .member-detail .value {
          flex: 1;
          word-wrap: break-word;
          max-height: 12px;
          overflow: hidden;
          color: #000000;
          font-weight: normal;
          line-height: 1.2;
        }
        
        .member-detail:last-child .value {
          max-height: 16px;
          overflow: hidden;
          line-height: 1.1;
        }
        
        .card-footer {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
          padding: 3px 6px;
          text-align: center;
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.3px;
          flex-shrink: 0;
        }
      </style>
    </head>
    <body>
      <div class="card-container">
        <!-- Card Header -->
        <div class="card-header">
          <div class="header-content">
            <div class="logo">
              <img src="data:image/svg+xml;base64,${Buffer.from(fs.readFileSync(path.join(process.cwd(), 'public', 'images', 'Logo-pgri-png.svg'), 'utf8')).toString('base64')}" 
                   width="29" height="29" style="border-radius: 50%; background: white; padding: 2px;" />
            </div>
            <div class="header-text">
              <h4>PERSATUAN GURU REPUBLIK INDONESIA</h4>
              <p>KABUPATEN OGAN KOMERING ULU TIMUR</p>
            </div>
          </div>
          <div class="kartu-anggota">KARTU ANGGOTA</div>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <!-- Photo Section -->
          <div class="photo-section">
            <div class="photo">
              ${member.photo ? 
                `<img src="http://localhost:3000${member.photo}" alt="Photo" style="width: 100%; height: 100%; object-fit: cover;" />` :
                `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSI+CiAgPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNmM2Y0ZjYiLz4KICA8cGF0aCBkPSJNMjAgMTJjMi4yIDAgNCAxLjggNCA0cy0xLjggNC00IDQtNC0xLjgtNC00IDEuOC00IDQtNHptMCAxNGMtNC40IDAtOC0xLjgtOC00djJjMCAyLjIgMy42IDQgOCA0czgtMS44IDgtNHYtMmMwIDIuMi0zLjYgNC04IDR6IiBmaWxsPSIjOWNhM2FmIi8+Cjwvc3ZnPgo=" alt="Photo" />`
              }
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-section">
            <div class="member-name">${member.name}</div>
            <div class="member-detail">
              <span class="label">TTL</span>
              <span class="colon">:</span>
              <span class="value">${member.birthPlace}, ${new Date(member.birthDate).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
            </div>
            <div class="member-detail">
              <span class="label">NPA</span>
              <span class="colon">:</span>
              <span class="value">${member.npa}</span>
            </div>
            <div class="member-detail">
              <span class="label">INSTANSI</span>
              <span class="colon">:</span>
              <span class="value">${member.institutionName}</span>
            </div>
            <div class="member-detail">
              <span class="label">STATUS</span>
              <span class="colon">:</span>
              <span class="value">${member.employeeStatus?.name || 'Lainnya'}</span>
            </div>
            <div class="member-detail">
              <span class="label">ALAMAT</span>
              <span class="colon">:</span>
              <span class="value">${member.address}</span>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          Berlaku sampai dengan 2025-2026
        </div>
      </div>
    </body>
    </html>
    `

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    })

    const page = await browser.newPage()
    
    // Set viewport to A4 size
    await page.setViewport({ width: 794, height: 1123 })
    
    // Set content
    await page.setContent(cardHTML, { waitUntil: 'networkidle0' })
    
    // Generate PDF with A4 dimensions
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' },
      preferCSSPageSize: false
    })

    await browser.close()

    // Return PDF
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="kartu-anggota-${member.name.replace(/\s+/g, '-')}.pdf"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Gagal membuat PDF' },
      { status: 500 }
    )
  }
}