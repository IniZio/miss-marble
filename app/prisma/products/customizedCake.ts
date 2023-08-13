import { type PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  // Product
  const customizedCake = await prisma.product.create({
    data: {
      id: '0000000-0000-0000-0000-000000000000',
      name: {
        create: {
          id: '0000000-0000-0000-0000-000000000000',
          text: { zh_Hant_HK: '訂製蛋糕專區' },
        }
      },
    }
  });

  // Fields
  await prisma.productField.create({
    data: {
      id: '0000000-0000-0000-0000-000000000000',
      name: {
        create: {
          id: '0000000-0000-0000-0000-000000000001',
          text: { zh_Hant_HK: '蛋糕味道' },
        },
      },
      product: { connect: { id: customizedCake.id } },
      type: 'SELECT',
      fieldValues: {
        create: {
          id: '0000000-0000-0000-0000-000000000000',
          name: {
            create: {
              id: '0000000-0000-0000-0000-000000000002',
              text: { zh_Hant_HK: '朱古力' },
            },
          },
        },
      },
    }
  });

  await prisma.productVariant.create({
    data: {
      id: '0000000-0000-0000-0000-000000000000',
      fieldValues: {
        connect: { id: '0000000-0000-0000-0000-000000000000' }
      },
      price: "0"
    }
  })
}