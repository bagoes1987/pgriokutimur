import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const educations = await prisma.education.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(educations)
  } catch (error) {
    console.error('Error fetching educations:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data pendidikan' },
      { status: 500 }
    )
  }
}