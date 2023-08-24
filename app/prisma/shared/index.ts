import { type PrismaClient } from '@prisma/client';
import { seed as seedCurrencies } from './currencies';

export async function seed(prisma: PrismaClient) {
  const currencies = await seedCurrencies(prisma);

  return { currencies } as const;
}