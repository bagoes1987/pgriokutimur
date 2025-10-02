import { NextRequest, NextResponse } from 'next/server'
import { authenticateAdmin, generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password harus diisi' },
        { status: 400 }
      )
    }

    const user = await authenticateAdmin(username, password)
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      )
    }

    const token = generateToken(user)
    
    // Set cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}