const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function deleteAboutData() {
  try {
    console.log('Menghapus semua data About dari database...')
    
    const result = await prisma.about.deleteMany({})
    
    console.log(`Berhasil menghapus ${result.count} record About`)
    
    // Verifikasi tidak ada data tersisa
    const remaining = await prisma.about.findMany()
    console.log(`Data About yang tersisa: ${remaining.length}`)
    
    if (remaining.length === 0) {
      console.log('✅ Database About sudah kosong, akan menggunakan konten statis')
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteAboutData()