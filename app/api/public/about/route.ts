import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const about = await prisma.about.findFirst({
      orderBy: {
        updatedAt: 'desc'
      }
    })

    if (!about) {
      // Return default about data if none exists
      return NextResponse.json({
        id: 1,
        title: 'Tentang PGRI Kabupaten OKU Timur',
        content: `
          <h2>Tentang PGRI Kabupaten OKU Timur</h2>
          <p>PGRI Kabupaten OKU Timur adalah bagian dari organisasi PGRI yang bertugas mengayomi dan memperjuangkan nasib guru di wilayah Kabupaten Ogan Komering Ulu Timur, Sumatera Selatan.</p>
          <p>Sebagai organisasi profesi guru, PGRI OKU Timur berkomitmen untuk terus meningkatkan kualitas pendidikan melalui pembinaan dan pengembangan kompetensi guru, serta memperjuangkan kesejahteraan anggota.</p>
        `,
        vision: 'Menjadi organisasi profesi guru yang terdepan dalam meningkatkan kualitas pendidikan dan kesejahteraan guru di Kabupaten OKU Timur.',
        mission: `
          <ul>
            <li>Meningkatkan kompetensi dan profesionalisme guru</li>
            <li>Memperjuangkan kesejahteraan anggota</li>
            <li>Mengembangkan kualitas pendidikan di daerah</li>
            <li>Membangun kerjasama dengan berbagai pihak</li>
          </ul>
        `,
        values: `
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-semibold text-pgri-red mb-2">Profesionalisme</h3>
              <p>Menjalankan tugas dengan kompetensi tinggi dan bertanggung jawab.</p>
            </div>
            <div>
              <h3 class="font-semibold text-pgri-red mb-2">Integritas</h3>
              <p>Menjunjung tinggi kejujuran dan transparansi dalam setiap tindakan.</p>
            </div>
            <div>
              <h3 class="font-semibold text-pgri-red mb-2">Solidaritas</h3>
              <p>Membangun kebersamaan dan saling mendukung antar anggota.</p>
            </div>
            <div>
              <h3 class="font-semibold text-pgri-red mb-2">Inovasi</h3>
              <p>Terus berinovasi dalam meningkatkan kualitas pendidikan.</p>
            </div>
          </div>
        `,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error fetching about data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    )
  }
}