import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const user = await getCurrentUser(token)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = parseInt(searchParams.get('period') || '30')
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period)

    // Get member statistics
    const totalMembers = await prisma.member.count()
    const approvedMembers = await prisma.member.count({
      where: { isApproved: true }
    })
    const pendingMembers = await prisma.member.count({
      where: { isApproved: false }
    })
    const rejectedMembers = 0 // No rejected status in current schema

    // Get news statistics
    const totalNews = await prisma.news.count()
    const publishedNews = await prisma.news.count({
      where: { isPublished: true }
    })

    // Get officer statistics
    const totalOfficers = await prisma.officer.count({
      where: { isActive: true }
    })
    
    const totalKabupatenOfficers = await prisma.officer.count({
      where: { 
        isActive: true,
        level: 'kabupaten'
      }
    })
    
    const totalCabangOfficers = await prisma.officer.count({
      where: { 
        isActive: true,
        level: 'cabang'
      }
    })

    // Get total views (mock data for now)
    const totalViews = { _sum: { viewCount: 0 } }

    // Get monthly registrations starting from October 2025 up to current month
    const monthlyRegistrations = []
    const START_YEAR = 2025
    const START_MONTH_INDEX = 9 // October (0-based)

    const now = new Date()
    const monthsSinceStart = (now.getFullYear() - START_YEAR) * 12 + (now.getMonth() - START_MONTH_INDEX)

    for (let i = 0; i <= monthsSinceStart; i++) {
      const year = START_YEAR + Math.floor((START_MONTH_INDEX + i) / 12)
      const monthIndex = (START_MONTH_INDEX + i) % 12

      const startOfMonth = new Date(year, monthIndex, 1)
      const startOfNextMonth = new Date(year, monthIndex + 1, 1)
      
      const count = await prisma.member.count({
        where: {
          createdAt: {
            gte: startOfMonth,
            lt: startOfNextMonth
          }
        }
      })
      
      monthlyRegistrations.push({
        month: startOfMonth.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        count
      })
    }

    // Get members by province (top 10)
    const membersByProvince = await prisma.member.groupBy({
      by: ['provinceId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    })

    // Get province names
    const provinceIds = membersByProvince.map(item => item.provinceId)
    const provinces = await prisma.province.findMany({
      where: {
        id: {
          in: provinceIds
        }
      },
      select: {
        id: true,
        name: true
      }
    })

    const membersByProvinceWithNames = membersByProvince.map(item => {
      const province = provinces.find(p => p.id === item.provinceId)
      return {
        province: province?.name || 'Unknown',
        count: item._count.id
      }
    })

    // Get recent activities (mock data for now)
    const recentMembers = await prisma.member.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        isApproved: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const recentNews = await prisma.news.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        isPublished: true,
        createdAt: true
      }
    })

    const recentActivities = [
      ...recentMembers.map(member => ({
        id: member.id,
        type: 'registration',
        description: `Anggota baru ${member.name} ${member.isApproved ? 'disetujui' : 'mendaftar'}`,
        timestamp: member.createdAt.toISOString()
      })),
      ...recentNews.map(news => ({
        id: news.id + 1000, // Offset to avoid ID conflicts
        type: 'news',
        description: `Berita "${news.title}" ${news.isPublished ? 'dipublikasikan' : 'dibuat'}`,
        timestamp: news.createdAt.toISOString()
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10)

    const stats = {
      totalMembers,
      approvedMembers,
      pendingMembers,
      rejectedMembers,
      totalNews,
      publishedNews,
      totalOfficers,
      totalKabupatenOfficers,
      totalCabangOfficers,
      totalViews: totalViews._sum.viewCount || 0,
      monthlyRegistrations,
      membersByProvince: membersByProvinceWithNames,
      recentActivities
    }

    return NextResponse.json({
      success: true,
      stats
    })

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}