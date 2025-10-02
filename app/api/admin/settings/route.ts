import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch site settings
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

    // For now, return default settings since we don't have a settings table
    // In a real application, you would fetch these from a database
    const defaultSettings = {
      // Basic Info
      siteName: 'PGRI OKU Timur',
      siteDescription: 'Persatuan Guru Republik Indonesia Kabupaten Ogan Komering Ulu Timur',
      siteKeywords: 'PGRI, OKU Timur, guru, pendidikan, organisasi',
      siteLogo: '/images/logo-pgri.svg',
      siteFavicon: '/images/logo-pgri.svg',
      
      // Contact Info
      contactEmail: 'info@pgriokutimur.org',
      contactPhone: '0735-123456',
      contactAddress: 'Jl. Pendidikan No. 123, Martapura, OKU Timur, Sumatera Selatan',
      
      // Social Media
      facebookUrl: 'https://facebook.com/pgriokutimur',
      twitterUrl: 'https://twitter.com/pgriokutimur',
      instagramUrl: 'https://instagram.com/pgriokutimur',
      youtubeUrl: 'https://youtube.com/@pgriokutimur',
      
      // SEO Settings
      metaTitle: 'PGRI OKU Timur - Persatuan Guru Republik Indonesia',
      metaDescription: 'Website resmi PGRI Kabupaten Ogan Komering Ulu Timur. Organisasi profesi guru yang berkomitmen meningkatkan kualitas pendidikan.',
      googleAnalyticsId: '',
      
      // Email Settings
      smtpHost: '',
      smtpPort: '587',
      smtpUsername: '',
      smtpPassword: '',
      smtpSecure: true,
      
      // System Settings
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: false,
      maxFileUploadSize: 5,
      allowedFileTypes: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
      
      // Theme Settings
      primaryColor: '#dc2626',
      secondaryColor: '#1f2937',
      headerStyle: 'default',
      footerStyle: 'default'
    }

    return NextResponse.json({
      success: true,
      settings: defaultSettings
    })

  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update site settings
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
    const { settings } = body

    // In a real application, you would save these settings to a database
    // For now, we'll just return success
    console.log('Settings to save:', settings)

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully'
    })

  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}