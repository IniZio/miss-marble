import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from '@trpc/server';

export const productRouter = createTRPCRouter({
  detail: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const product = await ctx.prisma.product.findUnique({
      where: { id: input },
      include: {
        name: true,
        gallery: true,
        fields: {
          include: {
            field: {
              include: {
                name: true,
                fieldOptions: {
                  include: {
                    name: true,
                  }
                }
              }
            }
          },
        }
      }
    });

    if (!product) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      });
    }

    return product;
  }),
  paginate: publicProcedure.input(
    z.object({
      pageIndex: z.number().min(0).nullish(),
      pageSize: z.number().min(1).max(100).nullish(),
    }),
  ).query(async ({ input, ctx }) => {
    const pageIndex = input.pageIndex ?? 0;
    const pageSize = input.pageSize ?? 10;

    const totalCount = await ctx.prisma.product.count();
    const pageCount = Math.ceil(totalCount / pageSize);
    const items = await ctx.prisma.product.findMany({
      skip: pageIndex * pageSize,
      take: pageSize, // get an extra item at the end which we'll use as next cursor
      include: {
        name: true,
        gallery: true,
        fields: {
          include: {
            field: {
              include: {
                name: true,
                fieldOptions: {
                  include: {
                    name: true,
                  }
                }
              }
            }
          },
        }
      }
    });

    return {
      items,
      pageCount,
      totalCount,
    };
  }),
});
