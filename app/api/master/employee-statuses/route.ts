import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const employeeStatuses = await prisma.employeeStatus.findMany({
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(employeeStatuses)
  } catch (error) {
    console.error('Error fetching employee statuses:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data status pegawai' },
      { status: 500 }
    )
  }
}