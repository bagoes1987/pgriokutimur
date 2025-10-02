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

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build date filter
    const dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }

    // Get member statistics
    const [
      totalMembers,
      pendingApprovals,
      approvedMembers,
      rejectedMembers
    ] = await Promise.all([
      prisma.member.count({ where: dateFilter }),
      prisma.member.count({ 
        where: { 
          ...dateFilter,
          isApproved: false 
        } 
      }),
      prisma.member.count({ 
        where: { 
          ...dateFilter,
          isApproved: true 
        } 
      }),
      prisma.member.count({ 
        where: { 
          ...dateFilter,
          isActive: false 
        } 
      })
    ]);

    // Get news statistics
    const [
      totalNews,
      publishedNews,
      draftNews
    ] = await Promise.all([
      prisma.news.count({ where: dateFilter }),
      prisma.news.count({ 
        where: { 
          ...dateFilter,
          isPublished: true 
        } 
      }),
      prisma.news.count({ 
        where: { 
          ...dateFilter,
          isPublished: false 
        } 
      })
    ]);

    // Get members by province
    const membersByProvince = await prisma.member.groupBy({
      by: ['provinceId'],
      where: dateFilter,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    // Get province names
    const provinceIds = membersByProvince.map(item => item.provinceId).filter(Boolean);
    const provinces = await prisma.province.findMany({
      where: { id: { in: provinceIds } },
      select: { id: true, name: true }
    });

    const membersByProvinceWithNames = membersByProvince.map(item => {
      const province = provinces.find(p => p.id === item.provinceId);
      return {
        province: province?.name || 'Tidak Diketahui',
        count: item._count.id
      };
    });

    // Get members by job/position
    const membersByPosition = await prisma.member.groupBy({
      by: ['jobId'],
      where: dateFilter,
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    // Get job names
    const jobIds = membersByPosition.map(item => item.jobId).filter(Boolean);
    const jobs = await prisma.job.findMany({
      where: { id: { in: jobIds } },
      select: { id: true, name: true }
    });

    const membersByPositionWithNames = membersByPosition.map(item => {
      const job = jobs.find(j => j.id === item.jobId);
      return {
        position: job?.name || 'Tidak Diketahui',
        count: item._count.id
      };
    });

    // Get member registration trend (12 months starting from October 2025)
    const memberRegistrationTrend = [];
    const START_YEAR = 2025;
    const START_MONTH_INDEX = 9; // October (0-based)

    for (let i = 0; i < 12; i++) {
      const year = START_YEAR + Math.floor((START_MONTH_INDEX + i) / 12);
      const monthIndex = (START_MONTH_INDEX + i) % 12;

      const startOfMonth = new Date(year, monthIndex, 1);
      const startOfNextMonth = new Date(year, monthIndex + 1, 1);

      const count = await prisma.member.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lt: startOfNextMonth
          }
        }
      });

      memberRegistrationTrend.push({
        month: startOfMonth.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        count
      });
    }

    // Get news publishing trend (last 12 months)
    const newsPublishingTrend = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const count = await prisma.news.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lte: endOfMonth
          },
          isPublished: true
        }
      });

      newsPublishingTrend.push({
        month: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        count
      });
    }

    const statistics = {
      totalMembers,
      pendingApprovals,
      approvedMembers,
      rejectedMembers,
      totalNews,
      publishedNews,
      draftNews,
      membersByProvince: membersByProvinceWithNames,
      membersByPosition: membersByPositionWithNames,
      memberRegistrationTrend,
      newsPublishingTrend
    };

    return NextResponse.json(statistics);

  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}