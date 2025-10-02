import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Update master data item
export async function PUT(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
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

    const { category, id } = params
    const body = await request.json()
    const { name, code, description } = body

    if (!name?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Name is required' },
        { status: 400 }
      )
    }

    let updatedItem

    switch (category) {
      case 'provinces':
        updatedItem = await prisma.province.update({
          where: { id: parseInt(id) },
          data: { name: name.trim(), code: code?.trim() || '' }
        })
        break
      case 'cities':
        updatedItem = await prisma.regency.update({
          where: { id: parseInt(id) },
          data: { name: name.trim(), code: code?.trim() || '' }
        })
        break
      case 'positions':
        updatedItem = await prisma.job.update({
          where: { id: parseInt(id) },
          data: { name: name.trim(), description: description?.trim() || '' }
        })
        break
      case 'school-types':
        updatedItem = await prisma.teachingLevel.update({
          where: { id: parseInt(id) },
          data: { name: name.trim(), description: description?.trim() || '' }
        })
        break
      case 'news-categories':
        updatedItem = await prisma.newsCategory.update({
          where: { id: parseInt(id) },
          data: { 
            name: name.trim(), 
            slug: name.trim().toLowerCase().replace(/\s+/g, '-'),
            description: description?.trim() || ''
          }
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
      message: 'Data updated successfully',
      data: {
        id: updatedItem.id.toString(),
        name: updatedItem.name,
        code: updatedItem.code || '',
        description: updatedItem.description || '',
        isActive: true,
        createdAt: updatedItem.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: updatedItem.updatedAt?.toISOString() || new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error updating master data:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete master data item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { category: string; id: string } }
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

    const { category, id } = params

    switch (category) {
      case 'provinces':
        await prisma.province.delete({
          where: { id: parseInt(id) }
        })
        break
      case 'cities':
        await prisma.regency.delete({
          where: { id: parseInt(id) }
        })
        break
      case 'positions':
        await prisma.job.delete({
          where: { id: parseInt(id) }
        })
        break
      case 'school-types':
        await prisma.teachingLevel.delete({
          where: { id: parseInt(id) }
        })
        break
      case 'news-categories':
        await prisma.newsCategory.delete({
          where: { id: parseInt(id) }
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
      message: 'Data deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting master data:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}