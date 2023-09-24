import { PrismaClient } from '@prisma/client'
import { seed as seedShared } from './shared';
import { seed as seedProductFields } from './productFields';
// import { seed as seedProducts } from './products';
// import { seed as seedCollections } from './collections';

const prisma = new PrismaClient()

async function main() {
  const shared = await seedShared(prisma);
  const productFields = await seedProductFields(prisma);
  // const products = await seedProducts(prisma, productFields);
  // const collections = await seedCollections(prisma, products);
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
