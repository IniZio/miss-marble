import { type PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  const hkd = await prisma.currency.create({
    data: {
      code: 'hkd',
      symbol: '$',
      name: {
        create: {
          text: { zh_Hant_HK: '港幣' },
        }
      },
    },
  });

  return { hkd } as const;
}