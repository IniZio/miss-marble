import { type PrismaClient } from '@prisma/client';
import { seed as seedCurrencies } from './currencies';
import { seed as seedShippingOptions } from './shippingOptions';

export async function seed(prisma: PrismaClient) {
  const currencies = await seedCurrencies(prisma);
  const shippingOptions = await seedShippingOptions(prisma);

  return { currencies, shippingOptions } as const;
}