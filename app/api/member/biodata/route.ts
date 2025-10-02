import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const user = await getCurrentUser(token)

    if (!user || user.role !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const member = await prisma.member.findUnique({
      where: { id: user.id },
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

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    console.log('📖 GET MEMBER API: Returning member data for ID:', user.id);
    console.log('📖 GET MEMBER API: Photo path in database:', member.photo);

    return NextResponse.json({
      success: true,
      member
    })

  } catch (error) {
    console.error('Error fetching member biodata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Token tidak ditemukan' },
        { status: 401 }
      )
    }

    const user = await getCurrentUser(token)
    
    if (!user || user.role !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    
    // Extract form fields
    const name = formData.get('name') as string
    const npa = formData.get('npa') as string
    const oldNpa = formData.get('oldNpa') as string
    const nik = formData.get('nik') as string
    const birthPlace = formData.get('birthPlace') as string
    const birthDate = formData.get('birthDate') as string
    const gender = formData.get('gender') as string
    const religionId = formData.get('religionId') as string
    const bloodType = formData.get('bloodType') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const address = formData.get('address') as string
    const provinceId = formData.get('provinceId') as string
    const regencyId = formData.get('regencyId') as string
    const districtId = formData.get('districtId') as string
    const village = formData.get('village') as string
    const postalCode = formData.get('postalCode') as string
    const institutionName = formData.get('institutionName') as string
    const jobId = formData.get('jobId') as string
    const employeeStatusId = formData.get('employeeStatusId') as string
    const rank = formData.get('rank') as string
    const workAddress = formData.get('workAddress') as string
    const educationId = formData.get('educationId') as string
    const hasEducatorCert = formData.get('hasEducatorCert') as string
    const subjects = formData.get('subjects') as string
    const photo = formData.get('photo') as File

    // Validate required fields
    if (!name || !phoneNumber || !address || !institutionName || !workAddress) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id: user.id }
    })

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      )
    }

    let photoPath = existingMember.photo

    // Handle photo upload
    if (photo && photo.size > 0) {
      console.log(`📸 MEMBER API: Photo upload started for member ID: ${user.id}`)
      console.log(`📸 MEMBER API: Photo file name: ${photo.name}`)
      console.log(`📸 MEMBER API: Photo file size: ${photo.size}`)
      
      // Delete old photo if exists
      if (existingMember.photo) {
        // Remove leading slash from photo path before joining with public directory
        const photoPathWithoutSlash = existingMember.photo.startsWith('/') ? existingMember.photo.slice(1) : existingMember.photo
        const oldPhotoPath = path.join(process.cwd(), 'public', photoPathWithoutSlash)
        console.log(`🗑️ MEMBER API: Checking old photo at: ${oldPhotoPath}`)
        
        if (existsSync(oldPhotoPath)) {
          try {
            await unlink(oldPhotoPath)
            console.log(`🗑️ MEMBER API: Old photo deleted successfully: ${existingMember.photo}`)
          } catch (error) {
            console.error(`❌ MEMBER API: Error deleting old photo: ${error}`)
            // Continue with upload even if deletion fails
          }
        } else {
          console.log(`🗑️ MEMBER API: Old photo file not found: ${oldPhotoPath}`)
        }
      } else {
        console.log(`📸 MEMBER API: No old photo to delete for member ID: ${user.id}`)
      }
      
      const bytes = await photo.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'members')
      try {
        await mkdir(uploadsDir, { recursive: true })
      } catch (error) {
        // Directory might already exist
      }

      // Generate unique filename
      const fileExtension = photo.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExtension}`
      const filePath = path.join(uploadsDir, fileName)
      
      console.log(`📸 MEMBER API: Generated filename: ${fileName}`)
      console.log(`📸 MEMBER API: Full file path: ${filePath}`)

      // Write new file
      await writeFile(filePath, buffer)
      photoPath = `/uploads/members/${fileName}`
      console.log(`📸 MEMBER API: New photo saved successfully, database path: ${photoPath}`)
    } else {
      console.log(`📸 MEMBER API: No photo file provided for member ID: ${user.id}`)
    }

    // Prepare update data
    const updateData: any = {
      name,
      phoneNumber,
      address,
      postalCode,
      institutionName,
      workAddress,
      rank: rank || null,
      subjects: subjects || null,
      updatedAt: new Date()
    }

    // Add optional fields if provided
    if (npa) updateData.npa = npa
    if (oldNpa) updateData.oldNpa = oldNpa
    if (nik) updateData.nik = nik
    if (birthPlace) updateData.birthPlace = birthPlace
    if (birthDate) updateData.birthDate = new Date(birthDate)
    if (gender) updateData.gender = gender
    if (religionId) updateData.religionId = parseInt(religionId)
    if (bloodType) updateData.bloodType = bloodType
    if (provinceId) updateData.provinceId = parseInt(provinceId)
    if (regencyId) updateData.regencyId = parseInt(regencyId)
    if (districtId) updateData.districtId = parseInt(districtId)
    if (village) updateData.village = village
    if (jobId) updateData.jobId = parseInt(jobId)
    if (employeeStatusId) updateData.employeeStatusId = parseInt(employeeStatusId)
    if (educationId) updateData.educationId = parseInt(educationId)
    if (hasEducatorCert) updateData.hasEducatorCert = hasEducatorCert === 'true'
    if (photoPath) {
      updateData.photo = photoPath
      console.log(`💾 MEMBER API: Adding photo to update data: ${photoPath}`)
    } else {
      console.log(`💾 MEMBER API: No photo to update for member ID: ${user.id}`)
    }

    // Handle teaching levels (many-to-many relationship)
    const teachingLevelsData = formData.get('teachingLevels')
    let teachingLevelsConnect = undefined
    if (teachingLevelsData) {
      try {
        // Check if it's already an object or a string
        let teachingLevels
        if (typeof teachingLevelsData === 'string') {
          teachingLevels = JSON.parse(teachingLevelsData)
        } else {
          teachingLevels = teachingLevelsData
        }
        
        if (Array.isArray(teachingLevels)) {
          teachingLevelsConnect = {
            set: [], // Clear existing connections
            connect: teachingLevels.map((id: number) => ({ id }))
          }
        }
      } catch (error) {
        console.error('Error parsing teaching levels:', error)
        console.error('Teaching levels data type:', typeof teachingLevelsData)
        console.error('Teaching levels data value:', teachingLevelsData)
      }
    }

    console.log(`💾 MEMBER API: Updating member in database with data:`, updateData)

    // Update member data
    const updatedMember = await prisma.member.update({
      where: { id: user.id },
      data: {
        ...updateData,
        ...(teachingLevelsConnect && { teachingLevels: teachingLevelsConnect })
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

    console.log(`✅ MEMBER API: Member updated successfully, new photo path: ${updatedMember.photo}`)
    console.log(`📤 MEMBER API: Sending response with final member data, photo: ${updatedMember.photo}`)

    return NextResponse.json({
      success: true,
      message: 'Biodata berhasil diperbarui',
      member: updatedMember
    })

  } catch (error) {
    console.error('Error updating member biodata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}