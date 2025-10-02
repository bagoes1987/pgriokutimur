import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

// POST - Handle both password reset request and password reset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // If token and password are provided, this is a password reset
    if (body.token && body.password) {
      return await handlePasswordReset(body);
    }
    
    // Otherwise, this is a password reset request
    return await handlePasswordResetRequest(body);
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// Handle password reset request (send email)
async function handlePasswordResetRequest({ email }: { email: string }) {
  try {
    if (!email) {
      return NextResponse.json(
        { message: 'Email harus diisi' },
        { status: 400 }
      );
    }

    // Check if member exists
    const member = await prisma.member.findUnique({
      where: { email }
    });

    if (!member) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        message: 'Jika email terdaftar, link reset password akan dikirim ke email Anda'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    await prisma.member.update({
      where: { id: member.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // For testing purposes, we'll log the reset token instead of sending email
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    
    // In development, log the reset URL for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('\n🔗 Reset Password URL for testing:');
      console.log(`📧 Email: ${email}`);
      console.log(`🔗 URL: ${resetUrl}`);
      console.log(`⏰ Expires: ${resetTokenExpiry}`);
      console.log('---');
    }

    // Try to send email, but don't fail if email service is not configured
    try {
      // Create email transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER || 'test@ethereal.email',
          pass: process.env.EMAIL_PASS || 'test123'
        }
      });

      // Send email
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'PGRI OKU Timur <noreply@pgri-okutimur.id>',
        to: email,
        subject: 'Reset Password - PGRI OKU Timur',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Reset Password PGRI OKU Timur</h2>
            <p>Halo <strong>${member.name}</strong>,</p>
            <p>Anda telah meminta untuk mereset password akun PGRI OKU Timur Anda.</p>
            <p>Klik tombol di bawah ini untuk mereset password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>Atau copy dan paste link berikut ke browser Anda:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            <p><strong>Link ini akan expired dalam 1 jam.</strong></p>
            <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              Email ini dikirim secara otomatis oleh sistem PGRI OKU Timur.<br>
              Jangan reply email ini.
            </p>
          </div>
        `
      });
      
      console.log('✅ Email sent successfully');
    } catch (emailError: any) {
      console.log('⚠️ Email sending failed, but reset token created:', emailError?.message || emailError);
      // Don't fail the request if email fails - token is still created
    }

    return NextResponse.json({
      message: 'Link reset password telah dikirim ke email Anda'
    });

  } catch (error) {
    console.error('Error in password reset request:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat memproses permintaan' },
      { status: 500 }
    );
  }
}

// Handle password reset (update password with token)
async function handlePasswordReset({ token, password }: { token: string; password: string }) {
  if (!token || !password) {
    return NextResponse.json(
      { message: 'Token dan password harus diisi' },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { message: 'Password minimal 6 karakter' },
      { status: 400 }
    );
  }

  // Find user with valid reset token
  const user = await prisma.member.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date() // Token must not be expired
      }
    }
  });

  if (!user) {
    return NextResponse.json(
      { message: 'Token reset password tidak valid atau sudah kedaluwarsa' },
      { status: 400 }
    );
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Update user password and clear reset token
  await prisma.member.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  });

  return NextResponse.json({
    message: 'Password berhasil direset'
  });
}