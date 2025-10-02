import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    // Remove orderBy to avoid potential Prisma validation mismatch
    const educations = await prisma.education.findMany()

    return NextResponse.json(educations)
  } catch (error) {
    console.error('Error fetching educations:', error)
    const message = (error as any)?.message || 'Gagal mengambil data pendidikan'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}