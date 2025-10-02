import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch admin profile and settings
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getCurrentUser(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get admin user details
    const admin = await prisma.admin.findUnique({
      where: { id: user.id }
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
        { status: 404 }
      )
    }

    // Default profile data
    const profile = {
      id: admin.id,
      name: admin.name || 'Administrator',
      email: admin.email || 'admin@pgriokutimur.org',
      phone: '+62 812 3456 7890', // Default phone since not in Admin model
      avatar: admin.photo || '',
      position: 'Administrator Sistem',
      department: 'IT Department',
      joinDate: admin.createdAt.toISOString(),
      lastLogin: admin.updatedAt.toISOString(),
      isActive: admin.isActive
    }

    // Default security settings
    const security = {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5
    }

    // Default notification settings
    const notifications = {
      emailNotifications: true,
      pushNotifications: true,
      memberRegistration: true,
      newsPublished: true,
      systemAlerts: true,
      weeklyReports: false
    }

    return NextResponse.json({
      success: true,
      profile,
      security,
      notifications
    })

  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    const user = token ? await getCurrentUser(token) : null
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { profile, security, notifications } = body

    // Update admin profile
    if (profile) {
      await prisma.admin.update({
        where: { id: user.id },
        data: {
          name: profile.name,
          email: profile.email,
          photo: profile.avatar
        }
      })
    }

    // In a real application, you would also save security and notification settings
    console.log('Security settings to save:', security)
    console.log('Notification settings to save:', notifications)

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Error updating admin profile:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}