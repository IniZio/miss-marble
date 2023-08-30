import { type PrismaClient } from '@prisma/client';

export async function seed(prisma: PrismaClient) {
  const cash = await prisma.paymentOption.create({
    data: {
      name: {
        create: {
          text: { zh_Hant_HK: '現金到付' },
        }
      },
    },
  });

  const payme = await prisma.paymentOption.create({
    data: {
      name: {
        create: {
          text: { zh_Hant_HK: 'Payme' },
        }
      },
      instructions: {
        create: {
          text: { zh_Hant_HK: '請於付款後，將收據發送至 23382338' },
        }
      }
    },
  });

  return { cash, payme } as const;
}