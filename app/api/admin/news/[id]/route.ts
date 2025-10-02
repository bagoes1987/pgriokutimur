import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const user = token ? await getCurrentUser(token) : null;
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, excerpt, content, isPublished, image, categoryId } = await request.json();

    // Check if news exists
    const newsId = parseInt(params.id)
    const existingNews = await prisma.news.findUnique({
      where: { id: newsId }
    });

    if (!existingNews) {
      return NextResponse.json(
        { success: false, message: 'News not found' },
        { status: 404 }
      );
    }

    // Generate slug from title if title is being updated
    let slug = existingNews.slug;
    if (title && title !== existingNews.title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
      
      // Ensure slug is unique
      const existingSlug = await prisma.news.findFirst({
        where: { 
          slug,
          id: { not: newsId }
        }
      });
      
      if (existingSlug) {
        slug = `${slug}-${Date.now()}`;
      }
    }

    // Update news
    const updatedNews = await prisma.news.update({
      where: { id: newsId },
      data: {
        title: title || existingNews.title,
        slug,
        excerpt: excerpt || existingNews.excerpt,
        content: content || existingNews.content,
        image: image !== undefined ? image : existingNews.image,
        categoryId: categoryId || existingNews.categoryId,
        isPublished: isPublished !== undefined ? isPublished : existingNews.isPublished,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: { name: true }
        },
        category: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'News updated successfully',
      news: updatedNews
    });

  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const user = token ? await getCurrentUser(token) : null;
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if news exists
    const newsId = parseInt(params.id)
    const existingNews = await prisma.news.findUnique({
      where: { id: newsId }
    });

    if (!existingNews) {
      return NextResponse.json(
        { success: false, message: 'News not found' },
        { status: 404 }
      );
    }

    // Delete news
    await prisma.news.delete({
      where: { id: newsId }
    });

    return NextResponse.json({
      success: true,
      message: 'News deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}