import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { prisma } from '@/server/db';

export const shippingOptionsRouter = createTRPCRouter({
  list: publicProcedure
    .query(() => {
      return prisma.shippingOption.findMany(
        {
          include: {
            name: true,
            price: true,
          },
        }
      );
    }),
});
