import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const user = await getCurrentUser(token)

    if (!user || user.role !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get member data with relations
    const member = await prisma.member.findUnique({
      where: { id: user.id },
      include: {
        religion: true,
        province: true,
        regency: true,
        district: true,
        job: true,
        education: true,
        employeeStatus: true,
        teachingLevels: true
      }
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    // Calculate stats
    const stats = {
      membershipStatus: member.isApproved ? 'approved' : 'pending',
      joinDate: member.createdAt.toISOString(),
      documentsCount: 0, // Will be implemented when document feature is added
      eventsAttended: 0, // Will be implemented when event feature is added
      certificatesEarned: member.hasEducatorCert ? 1 : 0
    }

    // Mock recent activities (replace with real data when features are implemented)
    const recentActivities = [
      {
        id: 1,
        type: 'registration',
        title: 'Pendaftaran anggota berhasil',
        date: member.createdAt.toISOString(),
        status: member.isApproved ? 'approved' : 'pending'
      },
      {
        id: 2,
        type: 'profile',
        title: 'Profil telah dilengkapi',
        date: member.updatedAt.toISOString(),
        status: 'completed'
      }
    ]

    // Mock upcoming events (replace with real data when event feature is implemented)
    const upcomingEvents = [
      {
        id: 1,
        title: 'Rapat Koordinasi Pengurus',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        location: 'Kantor PGRI OKU Timur',
        type: 'Rapat'
      },
      {
        id: 2,
        title: 'Workshop Pengembangan Kompetensi Guru',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        location: 'Aula PGRI OKU Timur',
        type: 'Workshop'
      }
    ]

    return NextResponse.json({
      member,
      stats,
      recentActivities,
      upcomingEvents
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}