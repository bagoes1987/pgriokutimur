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

    // Fetch all dropdown options
    const [
      religions,
      provinces,
      jobs,
      educations,
      employeeStatuses,
      teachingLevels
    ] = await Promise.all([
      prisma.religion.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.province.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.job.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.education.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.employeeStatus.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.teachingLevel.findMany({
        orderBy: { name: 'asc' }
      })
    ])

    return NextResponse.json({
      success: true,
      data: {
        religions,
        provinces,
        jobs,
        educations,
        employeeStatuses,
        teachingLevels
      }
    })

  } catch (error) {
    console.error('Error fetching biodata options:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}