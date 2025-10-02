import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const user = await getCurrentUser(token)
    
    if (!user || user.role !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const provinceId = searchParams.get('provinceId')

    if (!provinceId) {
      return NextResponse.json(
        { error: 'Province ID is required' },
        { status: 400 }
      )
    }

    const regencies = await prisma.regency.findMany({
      where: {
        provinceId: parseInt(provinceId)
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: regencies
    })

  } catch (error) {
    console.error('Error fetching regencies:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}