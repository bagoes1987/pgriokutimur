import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('Starting registration process...')
    console.log('Request headers:', Object.fromEntries(request.headers.entries()))
    
    let formData
    try {
      formData = await request.formData()
      console.log('FormData parsed successfully')
    } catch (parseError) {
      console.error('FormData parsing error:', parseError)
      return NextResponse.json(
        { error: 'Gagal memproses data formulir. Pastikan semua field terisi dengan benar.' },
        { status: 400 }
      )
    }
    
    // Extract form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const oldNpa = formData.get('oldNpa') as string || undefined
    const nik = formData.get('nik') as string
    const name = formData.get('name') as string
    const birthPlace = formData.get('birthPlace') as string
    const birthDate = formData.get('birthDate') as string
    const gender = formData.get('gender') as string
    const religionId = parseInt(formData.get('religionId') as string)
    const bloodType = formData.get('bloodType') as string || undefined
    const address = formData.get('address') as string
    const postalCode = formData.get('postalCode') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const photo = formData.get('photo') as File
    
    // Work data
    const provinceId = parseInt(formData.get('provinceId') as string)
    const regencyId = parseInt(formData.get('regencyId') as string)
    const districtId = parseInt(formData.get('districtId') as string)
    const village = formData.get('village') as string || undefined
    const institutionName = formData.get('institutionName') as string
    const workAddress = formData.get('workAddress') as string
    const jobId = parseInt(formData.get('jobId') as string)
    const educationId = parseInt(formData.get('educationId') as string)
    const employeeStatusId = parseInt(formData.get('employeeStatusId') as string)
    const rank = formData.get('rank') as string || undefined
    const hasEducatorCert = formData.get('hasEducatorCert') === 'true'
    const teachingLevels = JSON.parse(formData.get('teachingLevels') as string || '[]').map((id: any) => parseInt(id))
    const subjects = formData.get('subjects') as string || undefined

    // Detailed validation with specific field checking
    const missingFields = []
    
    if (!email) missingFields.push('email')
    if (!password) missingFields.push('password')
    if (!nik) missingFields.push('nik')
    if (!name) missingFields.push('name')
    if (!birthPlace) missingFields.push('birthPlace')
    if (!birthDate) missingFields.push('birthDate')
    if (!gender) missingFields.push('gender')
    if (!religionId || isNaN(religionId)) missingFields.push('religionId')
    if (!address) missingFields.push('address')
    if (!postalCode) missingFields.push('postalCode')
    if (!phoneNumber) missingFields.push('phoneNumber')
    if (!photo || photo.size === 0) missingFields.push('photo')
    if (!provinceId || isNaN(provinceId)) missingFields.push('provinceId')
    if (!regencyId || isNaN(regencyId)) missingFields.push('regencyId')
    if (!districtId || isNaN(districtId)) missingFields.push('districtId')
    if (!institutionName) missingFields.push('institutionName')
    if (!workAddress) missingFields.push('workAddress')
    if (!jobId || isNaN(jobId)) missingFields.push('jobId')
    if (!educationId || isNaN(educationId)) missingFields.push('educationId')
    if (!employeeStatusId || isNaN(employeeStatusId)) missingFields.push('employeeStatusId')
    
    console.log('Registration validation - Missing fields:', missingFields)
    console.log('Form data received:', {
      email, password: password ? '[HIDDEN]' : undefined, nik, name, birthPlace, birthDate,
      gender, religionId, address, postalCode, phoneNumber, 
      photoSize: photo?.size, provinceId, regencyId, districtId,
      institutionName, workAddress, jobId, educationId, employeeStatusId,
      teachingLevels
    })
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Field yang wajib diisi: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingMember = await prisma.member.findUnique({
      where: { email }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    // Check if NIK already exists
    const existingNik = await prisma.member.findUnique({
      where: { nik }
    })

    if (existingNik) {
      return NextResponse.json(
        { error: 'NIK sudah terdaftar' },
        { status: 400 }
      )
    }

    // Handle photo upload
    let photoPath = ''
    if (photo && photo.size > 0) {
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'members')
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const extension = photo.name.split('.').pop()
      const filename = `${timestamp}-${nik}.${extension}`
      const filepath = join(uploadsDir, filename)

      await writeFile(filepath, buffer)
      photoPath = `/uploads/members/${filename}`
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Generate NPA (membership number)
    const currentYear = new Date().getFullYear()
    const memberCount = await prisma.member.count()
    const npa = `${currentYear}${String(memberCount + 1).padStart(4, '0')}`

    // Create member
    const member = await prisma.member.create({
      data: {
        email,
        password: hashedPassword,
        plainPassword: password, // Simpan password asli untuk admin
        oldNpa,
        nik,
        name,
        birthPlace,
        birthDate: new Date(birthDate),
        gender,
        religionId,
        bloodType,
        address,
        postalCode,
        phoneNumber,
        photo: photoPath,
        provinceId,
        regencyId,
        districtId,
        village,
        institutionName,
        workAddress,
        jobId,
        educationId,
        employeeStatusId,
        rank,
        hasEducatorCert,
        subjects,
        isApproved: true,
        teachingLevels: {
          connect: teachingLevels.map((levelId: number) => ({
            id: levelId
          }))
        }
      },
      include: {
        religion: true,
        province: true,
        regency: true,
        district: true,
        job: true,
        education: true,
        employeeStatus: true,
        teachingLevels: true
      }
    })

    // Generate token and set cookie for auto-login
    const authUser = {
      id: member.id,
      email: member.email,
      name: member.name,
      role: 'member' as const,
      isActive: true
    }
    
    const token = generateToken(authUser)
    
    // Set cookie
    cookies().set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return NextResponse.json({
      message: 'Pendaftaran berhasil! Anda akan langsung masuk ke dashboard anggota.',
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        nik: member.nik,
        isApproved: member.isApproved
      },
      autoLogin: true
    })
  } catch (error) {
    console.error('Registration error:', error)
    console.error('Error stack:', error.stack)
    console.error('Error message:', error.message)
    
    // Log more details about the error
    if (error.code) {
      console.error('Error code:', error.code)
    }
    if (error.meta) {
      console.error('Error meta:', error.meta)
    }
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat mendaftar',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}