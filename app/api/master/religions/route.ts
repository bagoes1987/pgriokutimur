import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const religions = await prisma.religion.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(religions)
  } catch (error) {
    console.error('Error fetching religions:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data agama' },
      { status: 500 }
    )
  }
}