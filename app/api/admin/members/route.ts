import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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
    const searchNama = searchParams.get('searchNama') || '';
    const districtId = searchParams.get('districtId') || '';
    const status = searchParams.get('status') || 'ALL';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    const andConditions: any[] = [];
    
    // General search (email, NIK, NPA, institution)
    if (search) {
      andConditions.push({
        OR: [
          { email: { contains: search } },
          { nik: { contains: search } },
          { oldNpa: { contains: search } },
          { institutionName: { contains: search } }
        ]
      });
    }

    // Search by Nama
    if (searchNama) {
      andConditions.push({
        name: { contains: searchNama }
      });
    }

    // Filter by District ID
    if (districtId) {
      andConditions.push({
        districtId: parseInt(districtId)
      });
    }

    // Combine all conditions
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    if (status !== 'ALL') {
      where.isApproved = status === 'APPROVED';
    }

    // Get members with pagination
    const [members, totalCount] = await Promise.all([
      prisma.member.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          religion: { select: { name: true } },
          province: { select: { name: true } },
          regency: { select: { name: true } },
          district: { select: { name: true } },
          job: { select: { name: true } },
          education: { select: { name: true } },
          employeeStatus: { select: { name: true } },
          teachingLevels: { select: { name: true } }
        }
      }),
      prisma.member.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      members,
      totalPages,
      totalCount,
      totalEntries: totalCount,
      currentPage: page,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}