import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from '@/server/db';

export const paymentOptionsRouter = createTRPCRouter({
  list: publicProcedure
    .query(() => {
      return prisma.paymentOption.findMany(
        {
          include: {
            name: true,
            instructions: true,
          },
        }
      );
    }),
});
