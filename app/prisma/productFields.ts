import { type PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  // Taste
  const fieldTaste = await prisma.productField.create({
    data: {
      name: {
        create: { text: { zh_Hant_HK: '蛋糕味道' } },
      },
      type: 'SELECT',
    }
  });
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

  return { fieldTaste, fieldTasteValues } as const;
}