import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      jobs
    })
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data pekerjaan' },
      { status: 500 }
    )
  }
}