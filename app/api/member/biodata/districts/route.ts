import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
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
    const regencyId = searchParams.get('regencyId')

    if (!regencyId) {
      return NextResponse.json(
        { error: 'Regency ID is required' },
        { status: 400 }
      )
    }

    const districts = await prisma.district.findMany({
      where: {
        regencyId: parseInt(regencyId)
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: districts
    })

  } catch (error) {
    console.error('Error fetching districts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}