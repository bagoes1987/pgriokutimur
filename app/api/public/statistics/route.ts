import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // 1. Total Members
    const totalMembers = await prisma.member.count({
      where: {
        isActive: true,
        isApproved: true
      }
    })

    // Total News
    const totalNews = await prisma.news.count({
      where: {
        isPublished: true
      }
    })

    // Total Officers
    const totalOfficers = await prisma.officer.count({
      where: {
        isActive: true
      }
    })
    
    const totalKabupatenOfficers = await prisma.officer.count({
      where: {
        isActive: true,
        level: 'kabupaten'
      }
    })
    
    const totalCabangOfficers = await prisma.officer.count({
      where: {
        isActive: true,
        level: 'cabang'
      }
    })

    // 2. Members by District (Kecamatan)
    const membersByDistrict = await prisma.member.groupBy({
      by: ['districtId'],
      where: {
        isActive: true,
        isApproved: true
      },
      _count: {
        id: true
      }
    })

    const districtIds = membersByDistrict.map(item => item.districtId)
    const districts = await prisma.district.findMany({
      where: {
        id: { in: districtIds }
      }
    })

    const formattedMembersByDistrict = membersByDistrict.map(item => {
      const district = districts.find(d => d.id === item.districtId)
      return {
        district: district?.name || 'Tidak Diketahui',
        count: item._count.id
      }
    })

    // 3. Members by Gender (Jenis Kelamin)
    const membersByGender = await prisma.member.groupBy({
      by: ['gender'],
      where: {
        isActive: true,
        isApproved: true
      },
      _count: {
        id: true
      }
    })

    const formattedMembersByGender = membersByGender.map(item => ({
      gender: item.gender,
      count: item._count.id
    }))

    // 4. Members by Birth Year (Tahun Lahir)
    const membersByBirthYear = await prisma.member.findMany({
      where: {
        isActive: true,
        isApproved: true
      },
      select: {
        birthDate: true
      }
    })

    const birthYearStats = membersByBirthYear.reduce((acc, member) => {
      const year = new Date(member.birthDate).getFullYear()
      const ageGroup = year < 1970 ? '< 1970' : 
                     year < 1980 ? '1970-1979' :
                     year < 1990 ? '1980-1989' :
                     year < 2000 ? '1990-1999' : '≥ 2000'
      acc[ageGroup] = (acc[ageGroup] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const formattedMembersByBirthYear = Object.entries(birthYearStats).map(([yearGroup, count]) => ({
      yearGroup,
      count
    }))

    // 5. Members by Job (Pekerjaan)
    const membersByJob = await prisma.member.groupBy({
      by: ['jobId'],
      where: {
        isActive: true,
        isApproved: true
      },
      _count: {
        id: true
      }
    })

    const jobIds = membersByJob.map(item => item.jobId)
    const jobs = await prisma.job.findMany({
      where: {
        id: { in: jobIds }
      }
    })

    const formattedMembersByJob = membersByJob.map(item => {
      const job = jobs.find(j => j.id === item.jobId)
      return {
        job: job?.name || 'Tidak Diketahui',
        count: item._count.id
      }
    })

    // 6. Members by Education Level (Tingkat Pendidikan)
    const membersByEducation = await prisma.member.groupBy({
      by: ['educationId'],
      where: {
        isActive: true,
        isApproved: true
      },
      _count: {
        id: true
      }
    })

    const educationIds = membersByEducation.map(item => item.educationId)
    const educations = await prisma.education.findMany({
      where: {
        id: { in: educationIds }
      }
    })

    const formattedMembersByEducation = membersByEducation.map(item => {
      const education = educations.find(e => e.id === item.educationId)
      return {
        education: education?.name || 'Tidak Diketahui',
        count: item._count.id
      }
    })

    // 7. Members by Employee Status (Status Pegawai)
    const membersByEmployeeStatus = await prisma.member.groupBy({
      by: ['employeeStatusId'],
      where: {
        isActive: true,
        isApproved: true
      },
      _count: {
        id: true
      }
    })

    const employeeStatusIds = membersByEmployeeStatus.map(item => item.employeeStatusId)
    const employeeStatuses = await prisma.employeeStatus.findMany({
      where: {
        id: { in: employeeStatusIds }
      }
    })

    const formattedMembersByEmployeeStatus = membersByEmployeeStatus.map(item => {
      const status = employeeStatuses.find(s => s.id === item.employeeStatusId)
      return {
        status: status?.name || 'Tidak Diketahui',
        count: item._count.id
      }
    })

    // 8. Members by Educator Certificate (Sertifikat Pendidik)
    const membersByEducatorCert = await prisma.member.groupBy({
      by: ['hasEducatorCert'],
      where: {
        isActive: true,
        isApproved: true
      },
      _count: {
        id: true
      }
    })

    const formattedMembersByEducatorCert = membersByEducatorCert.map(item => ({
      hasEducatorCert: item.hasEducatorCert ? 'Memiliki Sertifikat' : 'Tidak Memiliki Sertifikat',
      count: item._count.id
    }))

    // 9. Members by Teaching Level (Jenjang Mengajar)
    const membersWithTeachingLevels = await prisma.member.findMany({
      where: {
        isActive: true,
        isApproved: true
      },
      include: {
        teachingLevels: true
      }
    })

    const teachingLevelStats = membersWithTeachingLevels.reduce((acc, member) => {
      if (member.teachingLevels.length === 0) {
        acc['Tidak Ada'] = (acc['Tidak Ada'] || 0) + 1
      } else {
        member.teachingLevels.forEach(level => {
          acc[level.name] = (acc[level.name] || 0) + 1
        })
      }
      return acc
    }, {} as Record<string, number>)

    const formattedMembersByTeachingLevel = Object.entries(teachingLevelStats).map(([level, count]) => ({
      teachingLevel: level,
      count
    }))

    // 10. Registration Statistics (Statistik Pendaftar)
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const [dailyRegistrations, monthlyRegistrations, yearlyRegistrations] = await Promise.all([
      prisma.member.count({
        where: {
          createdAt: {
            gte: startOfDay
          }
        }
      }),
      prisma.member.count({
        where: {
          createdAt: {
            gte: startOfMonth
          }
        }
      }),
      prisma.member.count({
        where: {
          createdAt: {
            gte: startOfYear
          }
        }
      })
    ])

    // Monthly registration trend (last 12 months) - run in parallel to improve performance
    const monthlyTrendPromises = Array.from({ length: 12 }).map((_, idx) => {
      // Keep chronological order from oldest to newest
      const offset = 11 - idx
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
      const nextDate = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1)

      return prisma.member.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      }).then(count => ({
        month: date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        count
      }))
    })

    const monthlyTrend = await Promise.all(monthlyTrendPromises)

    const registrationStats = {
      daily: dailyRegistrations,
      monthly: monthlyRegistrations,
      yearly: yearlyRegistrations,
      monthlyTrend
    }

    return NextResponse.json({
      totalMembers,
      totalNews,
      totalOfficers,
      totalKabupatenOfficers,
      totalCabangOfficers,
      membersByDistrict: formattedMembersByDistrict,
      membersByGender: formattedMembersByGender,
      membersByBirthYear: formattedMembersByBirthYear,
      membersByJob: formattedMembersByJob,
      membersByEducation: formattedMembersByEducation,
      membersByEmployeeStatus: formattedMembersByEmployeeStatus,
      membersByEducatorCert: formattedMembersByEducatorCert,
      membersByTeachingLevel: formattedMembersByTeachingLevel,
      registrationStats
    })
  } catch (error) {
    console.error('Statistics error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data statistik' },
      { status: 500 }
    )
  }
}