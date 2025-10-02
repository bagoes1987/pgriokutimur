import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const teachingLevels = await prisma.teachingLevel.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      teachingLevels
    })
  } catch (error) {
    console.error('Error fetching teaching levels:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data jenjang mengajar' },
      { status: 500 }
    )
  }
}