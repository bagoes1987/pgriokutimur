import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  id: number
  email?: string
  username?: string
  name: string
  role: 'admin' | 'member'
  isActive: boolean
}

// Convert string secret to Uint8Array for jose
const getSecretKey = () => {
  return new TextEncoder().encode(JWT_SECRET)
}

export async function generateTokenEdge(user: AuthUser): Promise<string> {
  const secret = getSecretKey()
  
  return await new SignJWT({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
    isActive: user.isActive
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function verifyTokenEdge(token: string): Promise<AuthUser | null> {
  try {
    console.log('VerifyTokenEdge: Attempting to verify token...')
    console.log('VerifyTokenEdge: Token length:', token.length)
    console.log('VerifyTokenEdge: JWT_SECRET exists:', !!JWT_SECRET)
    console.log('VerifyTokenEdge: JWT_SECRET length:', JWT_SECRET.length)
    
    const secret = getSecretKey()
    const { payload } = await jwtVerify(token, secret)
    const user: AuthUser = {
      id: typeof payload.id === 'number' ? payload.id : Number(payload.id),
      email: typeof payload.email === 'string' ? payload.email : undefined,
      username: typeof payload.username === 'string' ? payload.username : undefined,
      name: typeof payload.name === 'string' ? payload.name : '',
      role: payload.role === 'admin' ? 'admin' : 'member',
      isActive: payload.isActive === true
    }
    console.log('VerifyTokenEdge: Token verified successfully:', user)
    return user
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.log('VerifyTokenEdge: Token verification failed:', msg)
    return null
  }
}