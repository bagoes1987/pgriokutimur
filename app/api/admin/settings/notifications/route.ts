import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Update notification settings
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
    const { 
      emailNotifications, 
      pushNotifications, 
      memberRegistration, 
      newsPublished, 
      systemAlerts, 
      weeklyReports 
    } = body

    // In a real application, you would save these settings to a database
    // For now, we'll just log them and return success
    console.log('Notification settings to save:', {
      emailNotifications,
      pushNotifications,
      memberRegistration,
      newsPublished,
      systemAlerts,
      weeklyReports
    })

    return NextResponse.json({
      success: true,
      message: 'Notification settings updated successfully'
    })

  } catch (error) {
    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}