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

    const { status } = await request.json();
    const memberId = parseInt(params.id);

    // Validate status
    if (typeof status !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { id: memberId }
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      );
    }

    // Update member status
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: { 
        isApproved: status,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: `Member status updated to ${status ? 'approved' : 'pending'}`,
      member: updatedMember
    });

  } catch (error) {
    console.error('Error updating member status:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}