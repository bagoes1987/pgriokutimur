import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Cari setting untuk site logo
    const siteLogo = await prisma.settings.findUnique({
      where: {
        key: 'site_logo'
      }
    })

    // Jika tidak ada setting, return default
    if (!siteLogo) {
      return NextResponse.json({
        success: true,
        value: '/images/Logo PGRI.jpg' // Default logo path
      })
    }

    return NextResponse.json({
      success: true,
      value: siteLogo.value
    })

  } catch (error) {
    console.error('Get site logo error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil logo situs' 
      },
      { status: 500 }
    )
  }
}