import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const employeeStatuses = await prisma.employeeStatus.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({
      success: true,
      employeeStatuses
    })
  } catch (error) {
    console.error('Error fetching employee statuses:', error)
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil data status pegawai' },
      { status: 500 }
    )
  }
}