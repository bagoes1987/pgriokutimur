const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkMemberApproval() {
  try {
    console.log('=== Checking Member Approval Status ===\n')
    
    // Get all members with approval status
    const members = await prisma.member.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        isApproved: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Total members found: ${members.length}\n`)

    members.forEach((member, index) => {
      console.log(`${index + 1}. Member:`)
      console.log(`   ID: ${member.id}`)
      console.log(`   Name: ${member.name}`)
      console.log(`   Email: ${member.email}`)
      console.log(`   Is Approved: ${member.isApproved}`)
      console.log(`   Is Active: ${member.isActive}`)
      console.log(`   Created At: ${member.createdAt}`)
      console.log(`   Updated At: ${member.updatedAt}`)
      console.log('')
    })

    // Get counts
    const totalCount = await prisma.member.count()
    const approvedCount = await prisma.member.count({
      where: { isApproved: true }
    })
    const pendingCount = await prisma.member.count({
      where: { isApproved: false }
    })

    console.log('=== Summary ===')
    console.log(`Total Members: ${totalCount}`)
    console.log(`Approved Members: ${approvedCount}`)
    console.log(`Pending Members: ${pendingCount}`)

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkMemberApproval()