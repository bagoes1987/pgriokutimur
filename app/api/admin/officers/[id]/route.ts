import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET - Fetch single officer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getCurrentUser(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const officerId = parseInt(params.id)
    
    if (isNaN(officerId)) {
      return NextResponse.json({ message: 'Invalid officer ID' }, { status: 400 })
    }

    const officer = await prisma.officer.findUnique({
      where: { id: officerId },
      include: {
        district: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    if (!officer) {
      return NextResponse.json({ message: 'Officer not found' }, { status: 404 })
    }

    return NextResponse.json(officer)
  } catch (error) {
    console.error('Error fetching officer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update officer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getCurrentUser(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const officerId = parseInt(params.id)
    
    if (isNaN(officerId)) {
      return NextResponse.json({ message: 'Invalid officer ID' }, { status: 400 })
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

    // Check if officer exists
    const existingOfficer = await prisma.officer.findUnique({
      where: { id: officerId }
    })

    if (!existingOfficer) {
      return NextResponse.json({ message: 'Officer not found' }, { status: 404 })
    }

    // If level is Pengurus Cabang, districtId should be provided
    if (level === 'Pengurus Cabang' && !districtId) {
      return NextResponse.json(
        { message: 'District is required for Pengurus Cabang level officers' },
        { status: 400 }
      )
    }

    const officer = await prisma.officer.update({
      where: { id: officerId },
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

    return NextResponse.json(officer)
  } catch (error) {
    console.error('Error updating officer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete officer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getCurrentUser(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const officerId = parseInt(params.id)
    
    if (isNaN(officerId)) {
      return NextResponse.json({ message: 'Invalid officer ID' }, { status: 400 })
    }

    // Check if officer exists
    const existingOfficer = await prisma.officer.findUnique({
      where: { id: officerId }
    })

    if (!existingOfficer) {
      return NextResponse.json({ message: 'Officer not found' }, { status: 404 })
    }

    await prisma.officer.delete({
      where: { id: officerId }
    })

    return NextResponse.json({ message: 'Officer deleted successfully' })
  } catch (error) {
    console.error('Error deleting officer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}