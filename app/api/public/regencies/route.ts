import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const provinceId = searchParams.get('provinceId')

    let regencies
    if (provinceId) {
      regencies = await prisma.regency.findMany({
        where: {
          provinceId: parseInt(provinceId)
        },
        orderBy: { name: 'asc' }
      })
    } else {
      regencies = await prisma.regency.findMany({
        orderBy: { name: 'asc' }
      })
    }

    return NextResponse.json({
      success: true,
      regencies
    })
  } catch (error) {
    console.error('Error fetching regencies:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data kabupaten/kota' },
      { status: 500 }
    )
  }
}