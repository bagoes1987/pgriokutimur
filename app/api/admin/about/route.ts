import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const about = await prisma.about.findFirst({
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return NextResponse.json(about)
  } catch (error) {
    console.error('Error fetching about data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, vision, mission, values } = body

    // Validate required fields
    if (!title || !content || !vision || !mission) {
      return NextResponse.json(
        { error: 'Title, content, vision, and mission are required' },
        { status: 400 }
      )
    }

    // Delete existing about data (since we only want one record)
    await prisma.about.deleteMany({})

    // Create new about data
    const about = await prisma.about.create({
      data: {
        title,
        content,
        vision,
        mission,
        values: values || ''
      }
    })

    return NextResponse.json({
      success: true,
      message: 'About data created successfully',
      data: about
    })
  } catch (error) {
    console.error('Error creating about data:', error)
    return NextResponse.json(
      { error: 'Failed to create about data' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyToken(request)
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, title, content, vision, mission, values } = body

    // Validate required fields
    if (!title || !content || !vision || !mission) {
      return NextResponse.json(
        { error: 'Title, content, vision, and mission are required' },
        { status: 400 }
      )
    }

    let about
    if (id) {
      // Update existing record
      about = await prisma.about.update({
        where: { id: parseInt(id) },
        data: {
          title,
          content,
          vision,
          mission,
          values: values || ''
        }
      })
    } else {
      // Create new record if no ID provided
      await prisma.about.deleteMany({})
      about = await prisma.about.create({
        data: {
          title,
          content,
          vision,
          mission,
          values: values || ''
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'About data updated successfully',
      data: about
    })
  } catch (error) {
    console.error('Error updating about data:', error)
    return NextResponse.json(
      { error: 'Failed to update about data' },
      { status: 500 }
    )
  }
}