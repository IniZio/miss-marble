import { type PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  // Product
  const product = await prisma.product.create({
    data: {
      name: {
        create: {
          id: '0000000-0000-0000-0000-000000000000',
          text: { zh_Hant_HK: '訂製蛋糕專區' },
        }
      },
    }
  });

  // Fields
  const fields = [];
  const fieldTaste = await prisma.productField.create({
    data: {
      name: {
        create: { text: { zh_Hant_HK: '蛋糕味道' } },
      },
      product: { connect: { id: product.id } },
      type: 'SELECT',
    }
  });
  fields.push(fieldTaste);
  const fieldTasteValues = [
    await prisma.productFieldValue.create({
      data: {
        name: {
          create: { text: { zh_Hant_HK: '朱古力' } },
        },
        field: { connect: { id: fieldTaste.id } }
      }
    }),
  ];

  return product;
}