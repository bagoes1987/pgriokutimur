import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// GET - Verify reset token
export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid' },
        { status: 400 }
      );
    }

    // Find member with valid reset token
    const member = await prisma.member.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid atau sudah expired' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Token valid',
      memberName: member.name,
      memberEmail: member.email
    });

  } catch (error) {
    console.error('Error verifying reset token:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat memverifikasi token' },
      { status: 500 }
    );
  }
}

// POST - Reset password with token
export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    const { password, confirmPassword } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid' },
        { status: 400 }
      );
    }

    if (!password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Password dan konfirmasi password harus diisi' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Password dan konfirmasi password tidak sama' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 8 karakter' },
        { status: 400 }
      );
    }

    // Find member with valid reset token
    const member = await prisma.member.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Token tidak valid atau sudah expired' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and clear reset token
    await prisma.member.update({
      where: { id: member.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Password berhasil direset. Silakan login dengan password baru Anda.'
    });

  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan saat mereset password' },
      { status: 500 }
    );
  }
}