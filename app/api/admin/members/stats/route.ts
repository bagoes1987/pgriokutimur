import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    // Get member statistics
    const [total, pending, approved] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { isApproved: false } }),
      prisma.member.count({ where: { isApproved: true } })
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        total,
        pending,
        approved
      }
    });

  } catch (error) {
    console.error('Error fetching member stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}