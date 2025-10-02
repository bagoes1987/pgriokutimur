import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const searchNama = searchParams.get('searchNama') || ''
    const districtId = searchParams.get('districtId') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build where conditions
    const andConditions: any[] = [
      { isApproved: true }, // Only show approved members
      { isActive: true }    // Only show active members
    ]

    // Add name search condition
    if (searchNama.trim()) {
      andConditions.push({
        name: { 
          contains: searchNama.trim()
        }
      })
    }

    // Add district filter condition
    if (districtId.trim()) {
      andConditions.push({
        districtId: parseInt(districtId)
      })
    }

    const where = andConditions.length > 0 ? { AND: andConditions } : {}

    // Get total count for pagination
    const totalCount = await prisma.member.count({ where })

    // Get members with pagination
    const members = await prisma.member.findMany({
      where,
      include: {
        province: { select: { name: true } },
        regency: { select: { name: true } },
        district: { select: { name: true } },
        job: { select: { name: true } },
        education: { select: { name: true } },
        employeeStatus: { select: { name: true } }
      },
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: limit
    })

    // Format response data
    const formattedMembers = members.map(member => ({
      id: member.id,
      name: member.name,
      npa: member.npa || member.oldNpa,
      email: member.email,
      phone: member.phoneNumber,
      gender: member.gender,
      birthPlace: member.birthPlace,
      birthDate: member.birthDate,
      address: member.address,
      province: member.province?.name,
      regency: member.regency?.name,
      district: member.district?.name,
      village: member.village,
      job: member.job?.name,
      education: member.education?.name,
      employeeStatus: member.employeeStatus?.name,
      workplace: member.institutionName,
      workAddress: member.workAddress,
      subjects: member.subjects,
      joinDate: member.createdAt,
      status: member.isActive ? 'active' : 'inactive'
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        members: formattedMembers,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    })

  } catch (error) {
    console.error('Error searching members:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Terjadi kesalahan saat mencari anggota' 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}