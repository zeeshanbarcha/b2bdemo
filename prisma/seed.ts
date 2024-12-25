import { PrismaClient } from '@prisma/client'
import { categories, products } from '../config/products'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})

  // Create categories first
  for (const category of categories) {
    await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
      },
    })
  }

  // Create products
  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: `Description for ${product.name}`,
        price: product.price,
        images: product.images,
        discount: product.discount,
        inStock: 100,
        categoryId: product.category,
      },
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 