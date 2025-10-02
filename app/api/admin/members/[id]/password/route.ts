import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Get member password (admin only)
export async function GET(
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

    const member = await prisma.member.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        password: true
      }
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      password: member.password
    });

  } catch (error) {
    console.error('Error fetching member password:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}