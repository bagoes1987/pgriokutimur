import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const skip = (page - 1) * limit

    // Build where clause - only show published news
    const where: any = {
      isPublished: true
    };
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        take: limit,
        skip: skip,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          }
        }
      }),
      prisma.news.count({
        where
      })
    ])

    return NextResponse.json({
      news,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get news error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data berita' },
      { status: 500 }
    )
  }
}