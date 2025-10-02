import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET - Fetch all officers
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getCurrentUser(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const officers = await prisma.officer.findMany({
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

    return NextResponse.json(officers)
  } catch (error) {
    console.error('Error fetching officers:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new officer
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getCurrentUser(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, npa, position, level, periode, districtId, whatsapp, workplace, address, photo, order, isActive } = body

    // Validation
    if (!name || !position || !level) {
      return NextResponse.json(
        { message: 'Name, position, and level are required' },
        { status: 400 }
      )
    }

    // If level is Pengurus Cabang, districtId should be provided
    if (level === 'Pengurus Cabang' && !districtId) {
      return NextResponse.json(
        { message: 'District is required for Pengurus Cabang level officers' },
        { status: 400 }
      )
    }

    const officer = await prisma.officer.create({
      data: {
        name,
        npa: npa || null,
        position,
        level,
        periode: periode || '2025-2030',
        districtId: level === 'Pengurus Cabang' ? districtId : null,
        whatsapp: whatsapp || null,
        workplace: workplace || null,
        address: address || null,
        photo: photo || null,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        district: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(officer, { status: 201 })
  } catch (error) {
    console.error('Error creating officer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}