import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { published } = await request.json();
    
    const token = cookies().get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }

    const user = await getCurrentUser(token);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const newsId = parseInt(params.id);

    // Check if news exists
    const existingNews = await prisma.news.findUnique({
      where: { id: newsId }
    });

    if (!existingNews) {
      return NextResponse.json(
        { success: false, message: 'News not found' },
        { status: 404 }
      );
    }

    // Update publish status
    const updatedNews = await prisma.news.update({
      where: { id: newsId },
      data: { 
        isPublished: published,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: `News ${published ? 'published' : 'unpublished'} successfully`,
      news: updatedNews
    });

  } catch (error) {
    console.error('Error updating publish status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}