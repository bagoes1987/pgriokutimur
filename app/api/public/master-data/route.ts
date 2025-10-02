import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      religions,
      provinces,
      regencies,
      districts,
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
      prisma.regency.findMany({
        where: {
          province: {
            name: 'Sumatera Selatan'
          }
        },
        orderBy: { name: 'asc' }
      }),
      prisma.district.findMany({
        where: {
          regency: {
            name: 'Ogan Komering Ulu Timur'
          }
        },
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
      religions,
      provinces,
      regencies,
      districts,
      jobs,
      educations,
      employeeStatuses,
      teachingLevels
    })
  } catch (error) {
    console.error('Error fetching master data:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data master' },
      { status: 500 }
    )
  }
}