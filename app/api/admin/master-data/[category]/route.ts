import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch master data by category
export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getCurrentUser(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { category } = params
    let data = []

    switch (category) {
      case 'provinces':
        data = await prisma.province.findMany({
          orderBy: { name: 'asc' }
        })
        break
      case 'cities':
        data = await prisma.regency.findMany({
          include: {
            province: { select: { name: true } }
          },
          orderBy: { name: 'asc' }
        })
        break
      case 'positions':
        data = await prisma.job.findMany({
          orderBy: { name: 'asc' }
        })
        break
      case 'school-types':
        data = await prisma.teachingLevel.findMany({
          orderBy: { name: 'asc' }
        })
        break
      case 'news-categories':
        data = await prisma.newsCategory.findMany({
          orderBy: { name: 'asc' }
        })
        break
      case 'religions':
        data = await prisma.religion.findMany({
          orderBy: { name: 'asc' }
        })
        break
      case 'educations':
        data = await prisma.education.findMany({
          orderBy: { name: 'asc' }
        })
        break
      case 'employee-statuses':
        data = await prisma.employeeStatus.findMany({
          orderBy: { name: 'asc' }
        })
        break
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid category' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: (data as any[]).map(item => ({
        id: (item as any).id?.toString?.() || String((item as any).id),
        name: (item as any).name,
        code: ('code' in (item as any) ? ((item as any).code || '') : ''),
        description: ('description' in (item as any) ? ((item as any).description || '') : ''),
        isActive: true,
        createdAt: (item as any).createdAt ? new Date((item as any).createdAt).toISOString() : new Date().toISOString(),
        updatedAt: (item as any).updatedAt ? new Date((item as any).updatedAt).toISOString() : new Date().toISOString()
      }))
    })

  } catch (error) {
    console.error('Error fetching master data:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new master data item
export async function POST(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getCurrentUser(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { category } = params
    const body = await request.json()
    const { name, code, description } = body

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      )
    }

    let newItem

    switch (category) {
      case 'provinces':
        newItem = await prisma.province.create({
          data: { name: name.trim() }
        })
        break
      case 'cities':
        // For cities, we need a province ID - for now, default to first province
        const firstProvince = await prisma.province.findFirst()
        if (!firstProvince) {
          return NextResponse.json(
            { success: false, message: 'No provinces found' },
            { status: 400 }
          )
        }
        newItem = await prisma.regency.create({
          data: { 
            name: name.trim(), 
            provinceId: firstProvince.id
          }
        })
        break
      case 'positions':
        newItem = await prisma.job.create({
          data: { name: name.trim() }
        })
        break
      case 'school-types':
        newItem = await prisma.teachingLevel.create({
          data: { name: name.trim() }
        })
        break
      case 'news-categories':
        newItem = await prisma.newsCategory.create({
          data: { 
            name: name.trim(), 
            slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
            description: description?.trim() || ''
          }
        })
        break
      case 'religions':
        newItem = await prisma.religion.create({
          data: { name: name.trim() }
        })
        break
      case 'educations':
        newItem = await prisma.education.create({
          data: { name: name.trim() }
        })
        break
      case 'employee-statuses':
        newItem = await prisma.employeeStatus.create({
          data: { name: name.trim() }
        })
        break
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid category' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message: 'Data created successfully',
      data: {
        id: (newItem as any).id?.toString?.() || String((newItem as any).id),
        name: (newItem as any).name,
        code: ('code' in (newItem as any) ? (((newItem as any).code) || '') : ''),
        description: ('description' in (newItem as any) ? (((newItem as any).description) || '') : ''),
        isActive: true,
        createdAt: (newItem as any).createdAt ? new Date((newItem as any).createdAt).toISOString() : new Date().toISOString(),
        updatedAt: (newItem as any).updatedAt ? new Date((newItem as any).updatedAt).toISOString() : new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error creating master data:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}