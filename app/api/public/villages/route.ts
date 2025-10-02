import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const districtId = searchParams.get('districtId')

    let villages
    if (districtId) {
      villages = await prisma.village.findMany({
        where: {
          districtId: parseInt(districtId)
        },
        orderBy: { name: 'asc' }
      })
    } else {
      villages = await prisma.village.findMany({
        orderBy: { name: 'asc' }
      })
    }

    return NextResponse.json({
      success: true,
      villages
    })
  } catch (error) {
    console.error('Error fetching villages:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data desa/kelurahan' },
      { status: 500 }
    )
  }
}