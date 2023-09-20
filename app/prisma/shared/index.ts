import { type PrismaClient } from '@prisma/client';
import { seed as seedCurrencies } from './currencies';
import { seed as seedShippingOptions } from './shippingOptions';
import { seed as seedPaymentOptions } from './paymentOptions';
import { getSupabase } from '@/server/clients/supabase';
import { PUBLIC_STORAGE_BUCKET_NAME } from '@/constants';

export async function seed(prisma: PrismaClient) {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  await getSupabase().storage.createBucket(PUBLIC_STORAGE_BUCKET_NAME, { public: true }).catch(() => { });

  const currencies = await seedCurrencies(prisma);
  const shippingOptions = await seedShippingOptions(prisma);
  const paymentOptions = await seedPaymentOptions(prisma);

  return { currencies, shippingOptions, paymentOptions } as const;
}