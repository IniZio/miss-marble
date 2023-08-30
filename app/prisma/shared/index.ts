import { type PrismaClient } from '@prisma/client';
import { seed as seedCurrencies } from './currencies';
import { seed as seedShippingOptions } from './shippingOptions';
import { seed as seedPaymentOptions } from './paymentOptions';

export async function seed(prisma: PrismaClient) {
  const currencies = await seedCurrencies(prisma);
  const shippingOptions = await seedShippingOptions(prisma);
  const paymentOptions = await seedPaymentOptions(prisma);

  return { currencies, shippingOptions, paymentOptions } as const;
}