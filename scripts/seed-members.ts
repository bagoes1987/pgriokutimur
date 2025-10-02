import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedMembers() {
  try {
    console.log('🌱 Seeding members...')

    // Create sample members
    const members = [
      {
        oldNpa: 'NPA001',
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@gmail.com',
        nik: '1671234567890123',
        phoneNumber: '081234567890',
        gender: 'Perempuan',
        birthPlace: 'Martapura',
        birthDate: new Date('1985-05-15'),
        address: 'Jl. Pendidikan No. 123, Martapura',
        postalCode: '32181',
        institutionName: 'SDN 1 Martapura',
        workAddress: 'Jl. Sekolah No. 45, Martapura',
        rank: 'III/c',
        subjects: 'Matematika',
        isApproved: true,
        isActive: true,
        religionId: 1,
        provinceId: 1,
        regencyId: 1,
        districtId: 1,
        jobId: 1,
        educationId: 1,
        employeeStatusId: 1
      },
      {
        oldNpa: 'NPA002',
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@gmail.com',
        nik: '1671234567890124',
        phoneNumber: '081234567891',
        gender: 'Laki-Laki',
        birthPlace: 'Belitang',
        birthDate: new Date('1980-08-20'),
        address: 'Jl. Guru No. 456, Belitang',
        postalCode: '32182',
        institutionName: 'SMPN 2 Belitang',
        workAddress: 'Jl. Pendidikan No. 78, Belitang',
        rank: 'IV/a',
        subjects: 'Bahasa Indonesia',
        isApproved: false,
        isActive: true,
        religionId: 1,
        provinceId: 1,
        regencyId: 1,
        districtId: 2,
        jobId: 1,
        educationId: 2,
        employeeStatusId: 1
      },
      {
        oldNpa: 'NPA003',
        name: 'Dewi Sartika',
        email: 'dewi.sartika@gmail.com',
        nik: '1671234567890125',
        phoneNumber: '081234567892',
        gender: 'Perempuan',
        birthPlace: 'Cempaka',
        birthDate: new Date('1990-12-10'),
        address: 'Jl. Cempaka Raya No. 789, Cempaka',
        postalCode: '32183',
        institutionName: 'SMAN 1 Cempaka',
        workAddress: 'Jl. Sekolah Menengah No. 12, Cempaka',
        rank: 'III/b',
        subjects: 'Biologi',
        isApproved: true,
        isActive: true,
        religionId: 1,
        provinceId: 1,
        regencyId: 1,
        districtId: 3,
        jobId: 1,
        educationId: 2,
        employeeStatusId: 2
      },
      {
        oldNpa: 'NPA004',
        name: 'Budi Santoso',
        email: 'budi.santoso@gmail.com',
        nik: '1671234567890126',
        phoneNumber: '081234567893',
        gender: 'Laki-Laki',
        birthPlace: 'Semendawai',
        birthDate: new Date('1988-03-25'),
        address: 'Jl. Semendawai No. 321, Semendawai',
        postalCode: '32184',
        institutionName: 'SDN 3 Semendawai',
        workAddress: 'Jl. Pendidikan Dasar No. 56, Semendawai',
        rank: 'III/a',
        subjects: 'IPA',
        isApproved: false,
        isActive: true,
        religionId: 1,
        provinceId: 1,
        regencyId: 1,
        districtId: 4,
        jobId: 1,
        educationId: 1,
        employeeStatusId: 3
      },
      {
        oldNpa: 'NPA005',
        name: 'Rina Marlina',
        email: 'rina.marlina@gmail.com',
        nik: '1671234567890127',
        phoneNumber: '081234567894',
        gender: 'Perempuan',
        birthPlace: 'Buay Madang',
        birthDate: new Date('1992-07-18'),
        address: 'Jl. Buay Madang No. 654, Buay Madang',
        postalCode: '32185',
        institutionName: 'TK Pertiwi Buay Madang',
        workAddress: 'Jl. Anak Usia Dini No. 89, Buay Madang',
        rank: 'II/d',
        subjects: 'PAUD',
        isApproved: true,
        isActive: false,
        religionId: 1,
        provinceId: 1,
        regencyId: 1,
        districtId: 5,
        jobId: 1,
        educationId: 1,
        employeeStatusId: 2
      }
    ]

    // Create members
    for (const memberData of members) {
      const hashedPassword = await bcrypt.hash('member123', 10)
      
      await prisma.member.create({
        data: {
          ...memberData,
          password: hashedPassword
        }
      })
    }

    console.log('✅ Members seeded successfully!')
    console.log(`📊 Created ${members.length} members`)

  } catch (error) {
    console.error('❌ Error seeding members:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedMembers()