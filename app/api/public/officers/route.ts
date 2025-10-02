import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch active officers for public display
export async function GET() {
  try {
    const officers = await prisma.officer.findMany({
      where: {
        isActive: true
      },
      include: {
        district: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    // Transform data to match the interface expected by the frontend
    const transformedOfficers = officers.map(officer => ({
      id: officer.id,
      name: officer.name,
      position: officer.position,
      level: officer.level,
      district: officer.district,
      photo: officer.photo,
      order: officer.order,
      isActive: officer.isActive,
      whatsapp: officer.whatsapp,
      workplace: officer.workplace,
      address: officer.address,
      // For backward compatibility with frontend
      phone: officer.whatsapp,
      email: null, // Remove dummy email
      description: null // Remove dummy description
    }))

    return NextResponse.json(transformedOfficers)
  } catch (error) {
    console.error('Error fetching officers:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}