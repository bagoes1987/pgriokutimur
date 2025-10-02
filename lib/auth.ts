import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  id: number
  email?: string
  username?: string
  name: string
  npa?: string
  photoPath?: string | null
  role: 'admin' | 'member'
  isActive: boolean
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      role: user.role,
      isActive: user.isActive
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): AuthUser | null {
  try {
    console.log('VerifyToken: Attempting to verify token...')
    console.log('VerifyToken: Token length:', token.length)
    console.log('VerifyToken: JWT_SECRET exists:', !!JWT_SECRET)
    console.log('VerifyToken: JWT_SECRET length:', JWT_SECRET.length)
    
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    console.log('VerifyToken: Token verified successfully:', decoded)
    return decoded
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.log('VerifyToken: Token verification failed:', msg)
    return null
  }
}

export async function authenticateAdmin(username: string, password: string): Promise<AuthUser | null> {
  try {
    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin || !admin.isActive) {
      return null
    }

    const isValidPassword = await verifyPassword(password, admin.password)
    if (!isValidPassword) {
      return null
    }

    return {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      name: admin.name,
      role: 'admin',
      isActive: admin.isActive
    }
  } catch (error) {
    console.error('Admin authentication error:', error)
    return null
  }
}

export async function authenticateMember(email: string, password: string): Promise<AuthUser | null> {
  try {
    const member = await prisma.member.findUnique({
      where: { email }
    })

    if (!member || !member.isActive) {
      return null
    }

    const isValidPassword = await verifyPassword(password, member.password)
    if (!isValidPassword) {
      return null
    }

    return {
      id: member.id,
      email: member.email,
      name: member.name,
      role: 'member',
      isActive: member.isActive
    }
  } catch (error) {
    console.error('Member authentication error:', error)
    return null
  }
}

export async function getCurrentUser(token: string): Promise<AuthUser | null> {
  const user = verifyToken(token)
  if (!user) return null

  try {
    if (user.role === 'admin') {
      const admin = await prisma.admin.findUnique({
        where: { id: user.id }
      })
      
      if (!admin || !admin.isActive) return null
      
      return {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: 'admin',
        isActive: admin.isActive
      }
    } else {
      const member = await prisma.member.findUnique({
        where: { id: user.id }
      })
      
      if (!member || !member.isActive) return null
      
      return {
        id: member.id,
        email: member.email,
        name: member.name,
        npa: typeof member.npa === 'string'
          ? member.npa
          : (typeof member.oldNpa === 'string' ? member.oldNpa : undefined),
        photoPath: member.photo,
        role: 'member',
        isActive: member.isActive
      }
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}