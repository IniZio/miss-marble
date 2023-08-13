import { type PrismaClient } from '@prisma/client';
import { seed as seedCustomizedCake } from './customizedCake';

export async function seed(prisma: PrismaClient) {
  const customizedCake = await seedCustomizedCake(prisma);

  return { customizedCake } as const;
}