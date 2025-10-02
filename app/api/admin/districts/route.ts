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

    // Get districts from 'Ogan Komering Ulu Timur' regency (same as registration form)
    const districts = await prisma.district.findMany({
      where: {
        regency: {
          name: 'Ogan Komering Ulu Timur'
        }
      },
      select: {
        id: true,
        name: true,
        regency: {
          select: {
            name: true,
            province: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      districts: districts.map(district => ({
        id: district.id,
        name: district.name,
        fullName: district.name // Simplified since all are from same regency
      }))
    });

  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}