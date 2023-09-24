import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from '@trpc/server';
import { translationInputSchema, assetInputSchema } from '../admin/common';

export const orderRouter = createTRPCRouter({
  list: publicProcedure.input(
    z.object({
      dateStart: z.date(),
      dateEnd: z.date(),
      keyword: z.string().optional(),
    }),
  ).query(async ({ input, ctx }) => {
    const items = await ctx.prisma.order.findMany({
      where: {
        deliveryDate: {
          gte: input.dateStart,
          lte: input.dateEnd,
        },
        OR: [
          {
            phoneNumber: {
              contains: input.keyword,
            },
          },
          {
            socialHandle: {
              contains: input.keyword,
              mode: 'insensitive',
            },
          },
          {
            shippingAddress: {
              name: {
                contains: input.keyword,
                mode: 'insensitive',
              }
            },
            billingAddress: {
              name: {
                contains: input.keyword,
                mode: 'insensitive',
              }
            },
          },
        ],
      },
      include: {
        currency: true,
        items: {
          include: {
            product: {
              include: {
                name: true,
                gallery: true,
              },
            },
            productFieldValues: {
              include: {
                field: {
                  include: {
                    name: true,
                  }
                },
                fieldOption: {
                  include: {
                    name: true,
                  }
                },
                fieldOptionAsset: true,
              }
            },
          },
        },
        billingAddress: true,
        shippingAddress: true,
        shippingOption: {
          include: {
            name: true,
            price: true,
          }
        },
      },
    });

    return items;
  }),
});
