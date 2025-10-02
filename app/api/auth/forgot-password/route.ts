import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { message: 'Email harus diisi' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.member.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Email tidak ditemukan dalam sistem' },
        { status: 404 }
      )
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await prisma.member.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password/${resetToken}`

    // Configure email transporter with better error handling
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Verify transporter configuration
    try {
      await transporter.verify()
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError)
    }

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@pgri-okutimur.com',
      to: email,
      subject: 'Reset Password - PGRI OKU Timur',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Reset Password</h2>
          <p>Halo ${user.name},</p>
          <p>Anda telah meminta untuk mereset password akun PGRI OKU Timur Anda.</p>
          <p>Klik tombol di bawah ini untuk mereset password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 16px 0;">Reset Password</a>
          <p>Atau copy dan paste link berikut ke browser Anda:</p>
          <p style="word-break: break-all; color: #6B7280;">${resetUrl}</p>
          <p><strong>Link ini akan kedaluwarsa dalam 1 jam.</strong></p>
          <p>Jika Anda tidak meminta reset password, abaikan email ini.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; font-size: 14px;">
            Email ini dikirim secara otomatis dari sistem PGRI OKU Timur.<br>
            Jangan balas email ini.
          </p>
        </div>
      `
    }

    // Send email (only if SMTP is configured)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail(mailOptions)
        console.log('Reset email sent successfully to:', email)
      } catch (emailError) {
        console.error('Failed to send email:', emailError)
        // Continue anyway, just log the URL
        console.log('Email failed, but reset URL generated:', resetUrl)
      }
    } else {
      console.log('SMTP not configured. Reset URL:', resetUrl)
    }

    return NextResponse.json({
      message: 'Link reset password telah dikirim ke email Anda'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}