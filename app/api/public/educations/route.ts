import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const educations = await prisma.education.findMany()

    return NextResponse.json({
      success: true,
      educations
    })
  } catch (error) {
    console.error('Error fetching educations:', error)
    return NextResponse.json(
      { success: false, error: (error as any)?.message || 'Gagal mengambil data pendidikan' },
      { status: 500 }
    )
  }
}