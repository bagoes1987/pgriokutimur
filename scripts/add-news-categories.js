const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addNewsCategories() {
  try {
    // Check if categories already exist
    const existingCategories = await prisma.newsCategory.count();
    
    if (existingCategories > 0) {
      console.log('News categories already exist');
      return;
    }

    // Add default categories
    const categories = [
      {
        name: 'Berita Umum',
        slug: 'berita-umum',
        description: 'Berita umum dan informasi terkini'
      },
      {
        name: 'Pengumuman',
        slug: 'pengumuman',
        description: 'Pengumuman resmi organisasi'
      },
      {
        name: 'Kegiatan',
        slug: 'kegiatan',
        description: 'Informasi kegiatan dan acara'
      },
      {
        name: 'Pendidikan',
        slug: 'pendidikan',
        description: 'Berita seputar dunia pendidikan'
      }
    ];

    for (const category of categories) {
      await prisma.newsCategory.create({
        data: category
      });
      console.log(`Created category: ${category.name}`);
    }

    console.log('All news categories created successfully');
  } catch (error) {
    console.error('Error creating news categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addNewsCategories();