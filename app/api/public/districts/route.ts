import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const regencyId = searchParams.get('regencyId')

    let districts
    if (regencyId) {
      districts = await prisma.district.findMany({
        where: {
          regencyId: parseInt(regencyId)
        },
        orderBy: { name: 'asc' }
      })
    } else {
      districts = await prisma.district.findMany({
        orderBy: { name: 'asc' }
      })
    }

    return NextResponse.json({
      success: true,
      districts
    })
  } catch (error) {
    console.error('Error fetching districts:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data kecamatan' },
      { status: 500 }
    )
  }
}