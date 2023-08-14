import { type PrismaClient } from '@prisma/client';
import { type seed as seedProductFields } from '../productFields';
import { seed as seedCustomizedCake } from './customizedCake';
import { seed as seedLavaCake } from './lavaCake';

export async function seed(prisma: PrismaClient, productFields: Awaited<ReturnType<typeof seedProductFields>>) {
  const customizedCake = await seedCustomizedCake(prisma, productFields);
  const lavaCake = await seedLavaCake(prisma, productFields);

  return { customizedCake, lavaCake } as const;
}