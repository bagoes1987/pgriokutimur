const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateAdminName() {
  try {
    const result = await prisma.admin.updateMany({
      where: {
        username: 'admin'
      },
      data: {
        name: 'Admin'
      }
    })
    
    console.log('Admin name updated successfully:', result)
  } catch (error) {
    console.error('Error updating admin name:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminName()