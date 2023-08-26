import { type PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  const pickup = await prisma.shippingOption.create({
    data: {
      name: {
        create: {
          text: { zh_Hant_HK: '門市自取' },
        }
      },
      priceType: 'FLAT_RATE',
      price: { create: { currencyCode: 'hkd', amount: 0 } },
    },
  });

  const localDelivery = await prisma.shippingOption.create({
    data: {
      name: {
        create: {
          text: { zh_Hant_HK: '步兵送上門' },
        }
      },
      priceType: 'MANUAL',
    },
  });

  return { pickup, localDelivery } as const;
}