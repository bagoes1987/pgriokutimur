import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// GET - Get single member details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const user = token ? await getCurrentUser(token) : null;
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const member = await prisma.member.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        religion: { select: { name: true } },
        province: { select: { name: true } },
        regency: { select: { name: true } },
        district: { select: { name: true } },
        job: { select: { name: true } },
        education: { select: { name: true } },
        employeeStatus: { select: { name: true } },
        teachingLevels: { select: { name: true } }
      }
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      member
    });

  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update member
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const user = token ? await getCurrentUser(token) : null;
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse FormData
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const npa = formData.get('npa') as string;
    const oldNpa = formData.get('oldNpa') as string;
    const nik = formData.get('nik') as string;
    const phone = formData.get('phone') as string;
    const birthPlace = formData.get('birthPlace') as string;
    const birthDate = formData.get('birthDate') as string;
    const gender = formData.get('gender') as string;
    const bloodType = formData.get('bloodType') as string;
    const address = formData.get('address') as string;
    const postalCode = formData.get('postalCode') as string;
    const religionId = formData.get('religionId') as string;
    const provinceId = formData.get('provinceId') as string;
    const regencyId = formData.get('regencyId') as string;
    const districtId = formData.get('districtId') as string;
    const villageId = formData.get('villageId') as string;
    const institutionName = formData.get('institutionName') as string;
    const workAddress = formData.get('workAddress') as string;
    const jobId = formData.get('jobId') as string;
    const educationId = formData.get('educationId') as string;
    const employeeStatusId = formData.get('employeeStatusId') as string;
    const rank = formData.get('rank') as string;
    const hasEducatorCert = formData.get('hasEducatorCert') as string;
    const subjects = formData.get('subjects') as string;
    const teachingLevelIds = formData.get('teachingLevelIds') as string;
    const isApproved = formData.get('isApproved') as string;
    const isActive = formData.get('isActive') as string;
    const photoFile = formData.get('photo') as File;

    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!existingMember) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      );
    }

    // Check if NIK is unique (excluding current member)
    if (nik && nik !== existingMember.nik) {
      const existingNik = await prisma.member.findFirst({
        where: { 
          nik,
          id: { not: parseInt(params.id) }
        }
      });

      if (existingNik) {
        return NextResponse.json(
          { success: false, message: 'NIK sudah digunakan oleh anggota lain' },
          { status: 400 }
        );
      }
    }

    // Check if email is unique (excluding current member)
    if (email && email !== existingMember.email) {
      const existingEmail = await prisma.member.findFirst({
        where: { 
          email,
          id: { not: parseInt(params.id) }
        }
      });

      if (existingEmail) {
        return NextResponse.json(
          { success: false, message: 'Email sudah digunakan oleh anggota lain' },
          { status: 400 }
        );
      }
    }

    // Handle photo upload if provided
    let photoPath = null;
    if (photoFile && photoFile.size > 0) {
      try {
        console.log('📸 API: Photo upload started for member ID:', params.id);
        console.log('📸 API: Photo file name:', photoFile.name);
        console.log('📸 API: Photo file size:', photoFile.size);
        
        // Delete old photo if exists
        if (existingMember.photo) {
          // Remove leading slash from photo path before joining with public directory
          const photoPathWithoutSlash = existingMember.photo.startsWith('/') ? existingMember.photo.slice(1) : existingMember.photo;
          const oldPhotoPath = path.join(process.cwd(), 'public', photoPathWithoutSlash);
          console.log('🗑️ API: Checking old photo at:', oldPhotoPath);
          
          if (existsSync(oldPhotoPath)) {
            try {
              await unlink(oldPhotoPath);
              console.log('🗑️ API: Old photo deleted successfully:', existingMember.photo);
            } catch (error) {
              console.error('❌ API: Error deleting old photo:', error);
              // Continue with upload even if deletion fails
            }
          } else {
            console.log('🗑️ API: Old photo file not found:', oldPhotoPath);
          }
        } else {
          console.log('📸 API: No old photo to delete for member ID:', params.id);
        }
        
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'members');
        await mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = path.extname(photoFile.name);
        const fileName = `member_${params.id}_${timestamp}${fileExtension}`;
        const filePath = path.join(uploadsDir, fileName);

        console.log('📸 API: Generated filename:', fileName);
        console.log('📸 API: Full file path:', filePath);

        // Convert file to buffer and save new file
        const bytes = await photoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Set photo path for database (relative to public folder)
        photoPath = `/uploads/members/${fileName}`;
        console.log('📸 API: New photo saved successfully, database path:', photoPath);
      } catch (error) {
        console.error('❌ API: Error uploading photo:', error);
        return NextResponse.json(
          { success: false, message: 'Gagal mengupload foto' },
          { status: 500 }
        );
      }
    } else {
      console.log('📸 API: No photo file provided or file size is 0');
    }

    // Prepare update data, filtering out null/undefined foreign keys
    const updateData: any = {
      name,
      email,
      npa,
      oldNpa,
      nik,
      phoneNumber: phone,
      birthPlace,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      gender,
      bloodType,
      address,
      postalCode,
      village: villageId,
      institutionName,
      workAddress,
      rank,
      hasEducatorCert,
      subjects,
      isApproved: isApproved === 'true',
      isActive: isActive === 'true',
      updatedAt: new Date()
    };

    // Add photo if uploaded
    if (photoPath) {
      updateData.photo = photoPath;
      console.log('💾 API: Adding photo to update data:', photoPath);
    } else {
      console.log('💾 API: No photo to update');
    }

    // Only include foreign key fields if they have valid values
    if (religionId && religionId !== '' && religionId !== 'null') {
      updateData.religionId = parseInt(religionId);
    }
    if (provinceId && provinceId !== '' && provinceId !== 'null') {
      updateData.provinceId = parseInt(provinceId);
    }
    if (regencyId && regencyId !== '' && regencyId !== 'null') {
      updateData.regencyId = parseInt(regencyId);
    }
    if (districtId && districtId !== '' && districtId !== 'null') {
      updateData.districtId = parseInt(districtId);
    }
    if (jobId && jobId !== '' && jobId !== 'null') {
      updateData.jobId = parseInt(jobId);
    }
    if (educationId && educationId !== '' && educationId !== 'null') {
      updateData.educationId = parseInt(educationId);
    }
    if (employeeStatusId && employeeStatusId !== '' && employeeStatusId !== 'null') {
      updateData.employeeStatusId = parseInt(employeeStatusId);
    }

    // Update member
    console.log('💾 API: Updating member in database with data:', JSON.stringify(updateData, null, 2));
    const updatedMember = await prisma.member.update({
      where: { id: parseInt(params.id) },
      data: updateData,
      include: {
        religion: { select: { name: true } },
        province: { select: { name: true } },
        regency: { select: { name: true } },
        district: { select: { name: true } },
        job: { select: { name: true } },
        education: { select: { name: true } },
        employeeStatus: { select: { name: true } }
      }
    });
    console.log('✅ API: Member updated successfully, new photo path:', updatedMember.photo);

    // Update teaching levels if provided
    if (teachingLevelIds && teachingLevelIds !== '' && teachingLevelIds !== 'null') {
      try {
        const parsedTeachingLevels = JSON.parse(teachingLevelIds);
        if (Array.isArray(parsedTeachingLevels)) {
          await prisma.member.update({
            where: { id: parseInt(params.id) },
            data: {
              teachingLevels: {
                set: parsedTeachingLevels.map((levelId: number) => ({ id: levelId }))
              }
            }
          });
        }
      } catch (error) {
        console.error('Error parsing teaching levels:', error);
      }
    }

    // Fetch the final updated member data with all relations
    const finalUpdatedMember = await prisma.member.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        religion: { select: { name: true } },
        province: { select: { name: true } },
        regency: { select: { name: true } },
        district: { select: { name: true } },
        job: { select: { name: true } },
        education: { select: { name: true } },
        employeeStatus: { select: { name: true } },
        teachingLevels: { select: { id: true, name: true } }
      }
    });

    console.log('📤 API: Sending response with final member data, photo:', finalUpdatedMember?.photo);
    return NextResponse.json({
      success: true,
      message: 'Data anggota berhasil diperbarui',
      member: finalUpdatedMember || updatedMember
    });

  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    const user = token ? await getCurrentUser(token) : null;
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if member exists
    const existingMember = await prisma.member.findUnique({
      where: { id: parseInt(params.id) }
    });

    if (!existingMember) {
      return NextResponse.json(
        { success: false, message: 'Member not found' },
        { status: 404 }
      );
    }

    // Delete member (Prisma will handle many-to-many relations automatically)
    await prisma.member.delete({
      where: { id: parseInt(params.id) }
    });

    return NextResponse.json({
      success: true,
      message: 'Anggota berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}