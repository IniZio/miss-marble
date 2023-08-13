import { PrismaClient } from '@prisma/client'
import { seed as seedProducts } from './products';
import { seed as seedCollections } from './collections';

const prisma = new PrismaClient()

async function main() {
  const products = await seedProducts(prisma);
  const collections = await seedCollections(prisma, products);
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
