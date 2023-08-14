import { type PrismaClient } from '@prisma/client';
import { type seed as seedProducts } from './products';

export async function seed(prisma: PrismaClient, products: Awaited<ReturnType<typeof seedProducts>>) {
  const recommended = await prisma.productCollection.create({
    data: {
      slug: 'recommended',
      name: {
        create: {
          text: { zh_Hant_HK: '推薦' },
        }
      },
      products: {
        connect: [{ id: products.customizedCake.id }, { id: products.lavaCake.id }]
      }
    },
  });

  return { recommended } as const;
}