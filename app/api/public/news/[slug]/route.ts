import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const news = await prisma.news.findFirst({
      where: {
        slug: params.slug,
        isPublished: true
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

    if (!news) {
      return NextResponse.json(
        { success: false, message: 'News not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      news
    });

  } catch (error) {
    console.error('Error fetching news detail:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}