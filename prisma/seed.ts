import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Seed Religions
  const religions = [
    'Islam',
    'Kristen Protestan',
    'Katolik',
    'Hindu',
    'Buddha'
  ]

  for (const religion of religions) {
    await prisma.religion.upsert({
      where: { name: religion },
      update: {},
      create: { name: religion }
    })
  }

  // Seed Province (Sumatera Selatan)
  const province = await prisma.province.upsert({
    where: { name: 'Sumatera Selatan' },
    update: {},
    create: { name: 'Sumatera Selatan' }
  })

  // Seed Regency (OKU Timur)
  let regency = await prisma.regency.findFirst({
    where: { 
      name: 'Ogan Komering Ulu Timur',
      provinceId: province.id
    }
  })
  
  if (!regency) {
    regency = await prisma.regency.create({
      data: {
        name: 'Ogan Komering Ulu Timur',
        provinceId: province.id
      }
    })
  }

  // Seed Districts
  const districts = [
    'Belitang',
    'Belitang II',
    'Belitang III',
    'Belitang Jaya',
    'Belitang Madang Raya',
    'Belitang Mulya',
    'Buay Madang',
    'Buay Madang Timur',
    'Buay Pemuka Bangsa Raja',
    'Buay Pemuka Peliung',
    'Bunga Mayang',
    'Cempaka',
    'Jayapura',
    'Madang Suku I',
    'Madang Suku II',
    'Madang Suku III',
    'Martapura',
    'Semendawai Barat',
    'Semendawai Suku III',
    'Semendawai Timur'
  ]

  for (const districtName of districts) {
    const existingDistrict = await prisma.district.findFirst({
      where: { 
        name: districtName,
        regencyId: regency.id
      }
    })
    
    if (!existingDistrict) {
      await prisma.district.create({
        data: {
          name: districtName,
          regencyId: regency.id
        }
      })
    }
  }

  // Seed Jobs
  const jobs = [
    'Kepala Sekolah',
    'Guru',
    'Tenaga Administrasi',
    'Dosen',
    'Pengawas',
    'Lainnya'
  ]

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { name: job },
      update: {},
      create: { name: job }
    })
  }

  // Seed Education
  const educations = [
    'SMA/SMK/MA',
    'D3',
    'S1',
    'S2',
    'S3'
  ]

  for (const education of educations) {
    await prisma.education.upsert({
      where: { name: education },
      update: {},
      create: { name: education }
    })
  }

  // Seed Employee Status
  const employeeStatuses = [
    'PNS',
    'PPPK',
    'Honorer',
    'GTY',
    'GTTY',
    'Dosen ASN',
    'Dosen Tetap Yayasan',
    'Dosen Tidak Tetap Yayasan',
    'Lainnya'
  ]

  for (const status of employeeStatuses) {
    await prisma.employeeStatus.upsert({
      where: { name: status },
      update: {},
      create: { name: status }
    })
  }

  // Seed Teaching Levels
  const teachingLevels = [
    'PAUD',
    'TK',
    'SD',
    'SMP',
    'MTs',
    'SMA',
    'SMK',
    'MA',
    'SLB',
    'Universitas',
    'Lainnya'
  ]

  for (const level of teachingLevels) {
    await prisma.teachingLevel.upsert({
      where: { name: level },
      update: {},
      create: { name: level }
    })
  }

  // Seed Default Admin
  const hashedPassword = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@pgri-okutimur.id',
      password: hashedPassword,
      name: 'Admin'
    }
  })

  // Seed Demo Member
  const memberHashedPassword = await bcrypt.hash('member123', 12)
  
  // Get required reference data
  const religion = await prisma.religion.findFirst({ where: { name: 'Islam' } })
  const job = await prisma.job.findFirst({ where: { name: 'Guru' } })
  const education = await prisma.education.findFirst({ where: { name: 'S1' } })
  const employeeStatus = await prisma.employeeStatus.findFirst({ where: { name: 'PNS' } })
  const district = await prisma.district.findFirst({ where: { name: 'Belitang' } })
  const teachingLevel = await prisma.teachingLevel.findFirst({ where: { name: 'SD' } })

  if (religion && job && education && employeeStatus && district && regency && teachingLevel) {
    const member = await prisma.member.upsert({
      where: { email: 'member@demo.com' },
      update: {},
      create: {
        email: 'member@demo.com',
        password: memberHashedPassword,
        name: 'Demo Member PGRI',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'Jl. Demo No. 1, Belitang',
        postalCode: '32312',
        birthPlace: 'Belitang',
        birthDate: new Date('1990-01-01'),
        gender: 'Laki-Laki',
        religionId: religion.id,
        provinceId: province.id,
        regencyId: regency.id,
        districtId: district.id,
        village: 'Desa Demo',
        institutionName: 'SD Demo Belitang',
        workAddress: 'Jl. Sekolah No. 1, Belitang',
        jobId: job.id,
        educationId: education.id,
        employeeStatusId: employeeStatus.id,
        isActive: true,
        isApproved: true,
        teachingLevels: {
          connect: { id: teachingLevel.id }
        }
      }
    })
  }

  // Seed Settings
  const settings = [
    { key: 'site_logo', value: '' },
    { key: 'site_name', value: 'PGRI Kabupaten OKU Timur' },
    { key: 'site_description', value: 'Sistem Pendataan Keanggotaan PGRI Kabupaten OKU Timur' }
  ]

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }

  // Seed About
  await prisma.about.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Tentang PGRI Kabupaten OKU Timur",
      content: `<p>Persatuan Guru Republik Indonesia (PGRI) Kabupaten Ogan Komering Ulu Timur adalah organisasi profesi guru yang berkomitmen untuk meningkatkan kualitas pendidikan di wilayah OKU Timur.</p>`,
      vision: "Menjadi organisasi profesi guru yang terdepan dalam meningkatkan kualitas pendidikan dan kesejahteraan guru di Kabupaten OKU Timur.",
      mission: `<ul>
          <li>Meningkatkan profesionalisme guru melalui berbagai program pengembangan</li>
          <li>Memperjuangkan kesejahteraan anggota</li>
          <li>Berperan aktif dalam pembangunan pendidikan di daerah</li>
          <li>Membangun kerjasama dengan berbagai pihak untuk kemajuan pendidikan</li>
        </ul>`
    }
  })



  // Seed Settings
  const defaultSettings = [
    { key: 'site_logo', value: '/images/Logo PGRI.jpg' },
    { key: 'site_name', value: 'PGRI OKU Timur' },
    { key: 'site_description', value: 'Sistem Informasi Persatuan Guru Republik Indonesia Kabupaten OKU Timur' },
    { key: 'contact_email', value: 'info@pgriokutimur.org' },
    { key: 'contact_phone', value: '0735-123456' },
    { key: 'contact_address', value: 'Jl. Pendidikan No. 1, Belitang, OKU Timur' }
  ]

  for (const setting of defaultSettings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })