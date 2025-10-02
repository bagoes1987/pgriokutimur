import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const user = token ? await getCurrentUser(token) : null;
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'ALL';
    const status = searchParams.get('status') || 'ALL';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category !== 'ALL') {
      where.categoryId = category;
    }
    
    if (status !== 'ALL') {
      where.isPublished = status === 'PUBLISHED';
    }

    // Get news with pagination
    const [news, totalCount] = await Promise.all([
      prisma.news.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.news.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      news,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const user = token ? await getCurrentUser(token) : null;
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const categoryId = formData.get('categoryId') as string;
    const isPublished = formData.get('isPublished') === 'true';
    const imageFile = formData.get('image') as File;

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Handle image upload
    let imagePath = '';
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'news');
      await fs.mkdir(uploadsDir, { recursive: true });
      
      // Generate unique filename
      const fileExtension = path.extname(imageFile.name);
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Save file
      await fs.writeFile(filePath, buffer);
      imagePath = `/uploads/news/${fileName}`;
    }

    // Create news
    const news = await prisma.news.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        categoryId: categoryId ? parseInt(categoryId) : null,
        authorId: user.id,
        isPublished: isPublished || false,
        image: imagePath
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'News created successfully',
      news
    });

  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}